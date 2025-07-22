import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors';
import { fileURLToPath } from 'url';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import frontendApiRoutes from './routes/frontendApi.js';
import navigationApiRoutes from './routes/navigationApi.js';
import config from './config/config.js';

import { Setting } from './models/index.js';// Load env vars
dotenv.config();

// Connect to MongoDB with enhanced retry mechanism
let dbConnection;
(async () => {
  try {
    dbConnection = await connectDB();
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    console.log('Server will continue running with limited functionality');
  }
  
  // Set up a reconnection mechanism
  if (dbConnection?.connection?.readyState !== 1) {
    console.log('Setting up database reconnection attempts...');
    // Try to reconnect every 5 minutes
    setInterval(async () => {
      try {
        console.log('Attempting to reconnect to database...');
        dbConnection = await connectDB();
        if (dbConnection?.connection?.readyState === 1) {
          console.log('Successfully reconnected to database!');
        }
      } catch (error) {
        console.error('Database reconnection attempt failed:', error.message);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
})();

const app = express();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS with more permissive options for development
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if(!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values
    
    // Check if the origin is allowed
    if(allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      // Log the request details for debugging
      console.log('Request details:', {
        origin,
        method: 'CORS Preflight',
        allowedOrigins,
        isDevelopment: process.env.NODE_ENV === 'development'
      });
      callback(null, true); // Allow all origins in development for easier debugging
    }
  },
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Connection', 'X-Auth-Token']
}));

// Add CORS preflight options for all routes
app.options('*', cors());

// Add custom headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
  next();
});

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint for frontend to verify server status with enhanced diagnostics
app.get('/api/health-check', async (req, res) => {
  // Set explicit CORS headers for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
  
  // Check database connection status with enhanced diagnostics
  let dbStatus = 'unknown';
  let dbError = null;
  let dbDetails = {};
  
  try {
    // Check if mongoose is connected
    const mongoose = (await import('mongoose')).default;
    const readyState = mongoose.connection.readyState;
    
    // Map readyState to human-readable status
    const readyStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    dbStatus = readyStateMap[readyState] || 'unknown';
    dbDetails.readyState = readyState;
    
    if (dbStatus !== 'connected') {
      dbError = `Database connection is ${dbStatus}`;
      
      // Try to reconnect if disconnected
      if (dbStatus === 'disconnected') {
        console.log('Health check detected disconnected database, triggering reconnection...');
        try {
          // Attempt to reconnect
          dbConnection = await connectDB();
          
          // Check if reconnection was successful
          if (dbConnection?.connection?.readyState === 1) {
            dbStatus = 'reconnected';
            dbError = null;
            dbDetails.reconnectAttempt = 'successful';
          } else {
            dbDetails.reconnectAttempt = 'failed';
          }
        } catch (reconnectError) {
          dbDetails.reconnectAttempt = 'failed';
          dbDetails.reconnectError = reconnectError.message;
        }
      }
    } else {
      // If connected, get more details
      try {
        dbDetails.host = mongoose.connection.host;
        dbDetails.name = mongoose.connection.name;
        
        // Try a quick ping to verify actual connection
        const pingResult = await mongoose.connection.db.admin().ping();
        dbDetails.pingTest = pingResult?.ok === 1 ? 'successful' : 'failed';
      } catch (detailsError) {
        dbDetails.detailsError = detailsError.message;
      }
    }
  } catch (error) {
    dbStatus = 'error';
    dbError = error.message;
    console.error('Health check database error:', error);
  }
  
  // Return detailed status information
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    database: {
      status: dbStatus,
      error: dbError,
      details: dbDetails
    },
    uptime: process.uptime() + ' seconds'
  });
});

// Add a root health check endpoint as well
app.get('/health-check', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Add a comprehensive system status endpoint with enhanced database diagnostics
app.get('/api/system-status', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    // Check database connection with detailed diagnostics
    const mongoose = (await import('mongoose')).default;
    const dbConnected = mongoose.connection.readyState === 1;
    
    // Get more detailed database information
    let dbDetails = {
      status: dbConnected ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
      name: process.env.MONGO_URI ? new URL(process.env.MONGO_URI).pathname.substring(1) : 'unknown',
      host: process.env.MONGO_URI ? new URL(process.env.MONGO_URI).hostname : 'unknown',
      connectionTime: dbConnected ? new Date().toISOString() : null,
      lastReconnectAttempt: dbConnection?._lastReconnectAttempt ? new Date(dbConnection._lastReconnectAttempt).toISOString() : null
    };
    
    // If not connected, try a quick connection test
    if (!dbConnected) {
      try {
        console.log('Database not connected, attempting quick connection test...');
        // Try to perform a simple operation to test connection
        const testResult = await mongoose.connection.db.admin().ping();
        if (testResult && testResult.ok === 1) {
          dbDetails.pingTest = 'successful';
          dbDetails.status = 'connected but not ready'; // Strange state where ping works but readyState is not 1
        } else {
          dbDetails.pingTest = 'failed';
        }
      } catch (dbTestError) {
        dbDetails.pingTest = 'failed';
        dbDetails.pingError = dbTestError.message;
        
        // Try to reconnect
        console.log('Triggering database reconnection attempt...');
        try {
          dbConnection = await connectDB();
          dbDetails.reconnectAttempt = 'triggered';
          dbDetails.reconnectResult = dbConnection?.connection?.readyState === 1 ? 'successful' : 'failed';
          if (dbConnection?.connection?.readyState === 1) {
            dbDetails.status = 'reconnected';
          }
        } catch (reconnectError) {
          dbDetails.reconnectAttempt = 'failed';
          dbDetails.reconnectError = reconnectError.message;
        }
      }
    }
    
    // Get system information
    const systemInfo = {
      platform: process.platform,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime() + ' seconds',
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      status: 'ok',
      server: {
        status: 'running',
        timestamp: new Date().toISOString()
      },
      database: dbDetails,
      system: systemInfo
    });
  } catch (error) {
    console.error('Error in system-status endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving system status',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Body parser
app.use(express.json());

// Set static folder for frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Set static folder for uploads with enhanced CORS headers
app.use('/uploads', (req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log the request for debugging
  console.log(`Static file request: ${req.method} ${req.originalUrl}`);
  
  next();
}, express.static(path.resolve(process.cwd(), config.uploadDir), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Add a direct route to serve uploads for debugging
app.get('/uploads-debug/*', (req, res) => {
  const filePath = req.path.replace('/uploads-debug/', '');
  const fullPath = path.resolve(process.cwd(), config.uploadDir, filePath);
  console.log('Debug file request:', {
    requestPath: req.path,
    filePath,
    fullPath,
    exists: fs.existsSync(fullPath)
  });
  
  if (fs.existsSync(fullPath)) {
    return res.sendFile(fullPath);
  } else {
    return res.status(404).json({
      success: false,
      message: 'File not found',
      path: fullPath
    });
  }
});

// Mount API routes
app.use('/api', apiRoutes);
app.use('/api', frontendApiRoutes);
// Mount navigation routes correctly
app.use('/api/navigation', navigationApiRoutes);

// Maintenance mode middleware
app.use(async (req, res, next) => {
  // Skip maintenance check for API routes and admin routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    return next();
  }

  try {
    const Setting = (await import('./models/Setting.js')).default;
    const settings = await Setting.findOne();

    if (settings && settings.maintenanceMode) {
      return res.status(503).send(`
        <html>
          <head>
            <title>Site Maintenance</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #333; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <h1>Site Under Maintenance</h1>
            <p>${settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.'}</p>
          </body>
        </html>
      `);
    }
    next();
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    next();
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);