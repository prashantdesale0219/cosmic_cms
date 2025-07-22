import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB with enhanced retry mechanism
const connectDB = async () => {
  const MAX_RETRIES = 10; // Increased from 5 to 10
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempting to connect to MongoDB (attempt ${retries + 1}/${MAX_RETRIES})...`);
      
      // Log connection details (without sensitive info)
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cosmic_cms';
      const parsedUri = new URL(mongoUri.startsWith('mongodb') ? mongoUri : `mongodb://${mongoUri}`);
      
      console.log('Connection details:', {
        host: parsedUri.hostname,
        database: parsedUri.pathname.substring(1) || 'cosmic_cms',
        timestamp: new Date().toISOString(),
        retryAttempt: retries + 1
      });
      
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // Timeout after 10s
        socketTimeoutMS: 45000, // Socket timeout increased to 45s
        heartbeatFrequencyMS: 10000, // Heartbeat frequency increased
        maxPoolSize: 10, // Connection pool size
        minPoolSize: 2, // Minimum connections maintained
        family: 4 // Use IPv4, skip trying IPv6
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      console.error('Error details:', {
        code: err.code,
        name: err.name,
        timestamp: new Date().toISOString(),
        retryAttempt: retries + 1
      });
      
      retries += 1;
      
      if (retries === MAX_RETRIES) {
        console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Server will start but database functionality will be limited.`);
        // Don't exit the process, allow the application to continue
        return { connection: { readyState: 0 } }; // Return a mock connection object
      }
      
      // Wait before trying again, increasing the delay with each retry
      const delay = 2000 * Math.pow(2, retries); // Exponential backoff: 4s, 8s, 16s, 32s, 64s, etc.
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;