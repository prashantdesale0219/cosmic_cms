# Cosmic CMS सेटअप निर्देश

## सिस्टम ओवरव्यू

इस प्रोजेक्ट में तीन मुख्य भाग हैं:

1. **Backend (API Server)** - पोर्ट 5000 पर चलता है
2. **Dashboard (Admin Panel)** - पोर्ट 5175 पर चलता है
3. **Frontend (Main Website)** - पोर्ट 5174 पर चलता है

## सेटअप स्टेप्स

### 1. MongoDB सेटअप

- MongoDB को स्थानीय रूप से इंस्टॉल करें या MongoDB Atlas का उपयोग करें
- MongoDB को पोर्ट 27017 पर चलाएं (डिफॉल्ट पोर्ट)

### 2. Backend सेटअप

```bash
cd backend
npm install
```

### 3. Dashboard सेटअप

```bash
cd dashboard
npm install
```

### 4. Frontend सेटअप

```bash
cd cosmic-main
npm install
```

## सर्वर्स को चलाना

सभी सर्वर्स को एक साथ चलाने के लिए, बस रूट डायरेक्टरी से निम्न बैच फाइल चलाएं:

```
start-all-servers.bat
```

या आप प्रत्येक सर्वर को अलग-अलग चला सकते हैं:

### Backend सर्वर चलाना

```bash
cd backend
npm run dev
```

### Dashboard सर्वर चलाना

```bash
cd dashboard
npm run dev
```

### Frontend सर्वर चलाना

```bash
cd cosmic-main
npm run dev
```

## URL एक्सेस

- **Backend API**: http://localhost:5000/api
- **Dashboard**: http://localhost:5175
- **Frontend**: http://localhost:5174

## समस्या निवारण

### पोर्ट कॉन्फ्लिक्ट

यदि पोर्ट पहले से उपयोग में है, तो आप निम्न फाइलों में पोर्ट बदल सकते हैं:

- Backend: `backend/.env` में `PORT` वैरिएबल
- Dashboard: `dashboard/vite.config.js` में `server.port`
- Frontend: `cosmic-main/vite.config.js` में `server.port`

### API कनेक्शन समस्याएं

1. सुनिश्चित करें कि backend सर्वर चल रहा है
2. `.env` फाइलों में API URL की जांच करें
3. CORS सेटिंग्स की जांच करें (`backend/server.js` में)

### डेटाबेस कनेक्शन समस्याएं

1. सुनिश्चित करें कि MongoDB चल रहा है
2. `backend/.env` में `MONGO_URI` की जांच करें