# Cosmic CMS

## प्रोजेक्ट परिचय

Cosmic CMS एक वेबसाइट कंटेंट मैनेजमेंट सिस्टम है जो बैकएंड और फ्रंटएंड के बीच सहज इंटरैक्शन प्रदान करता है। इसमें प्रोडक्ट्स, ब्लॉग पोस्ट्स, प्रोजेक्ट्स और अन्य कंटेंट को मैनेज करने की क्षमता है।

## प्रोजेक्ट स्ट्रक्चर

```
cosmic_cms/
├── backend/           # Express.js बैकएंड
└── cosmic-main/       # React/Vite फ्रंटएंड
```

## सेटअप निर्देश

### आवश्यकताएँ

- Node.js (v14 या उससे ऊपर)
- npm (v6 या उससे ऊपर)
- MongoDB

### इंस्टॉलेशन

1. बैकएंड सेटअप:

```bash
cd backend
npm install
```

2. फ्रंटएंड सेटअप:

```bash
cd cosmic-main
npm install
```

### डेवलपमेंट सर्वर चलाना

दोनों सर्वर एक साथ चलाने के लिए, रूट डायरेक्टरी से निम्न कमांड चलाएँ:

```bash
./start-dev.bat
```

या अलग-अलग टर्मिनल विंडो में:

1. बैकएंड सर्वर:

```bash
cd backend
npm run dev
```

2. फ्रंटएंड सर्वर:

```bash
cd cosmic-main
npm run dev
```

## एक्सेस

- बैकएंड API: http://localhost:5000
- फ्रंटएंड: http://localhost:5174

## API एंडपॉइंट्स

### प्रोडक्ट्स

- `GET /api/products` - सभी प्रोडक्ट्स प्राप्त करें
- `GET /api/products/active` - सभी एक्टिव प्रोडक्ट्स प्राप्त करें
- `GET /api/products/featured` - फीचर्ड प्रोडक्ट्स प्राप्त करें
- `GET /api/products/id/:id` - आईडी द्वारा प्रोडक्ट प्राप्त करें
- `GET /api/products/slug/:slug` - स्लग द्वारा प्रोडक्ट प्राप्त करें
- `POST /api/products` - नया प्रोडक्ट बनाएँ (JWT ऑथेंटिकेशन आवश्यक)

### ब्लॉग पोस्ट्स

- `GET /api/blog-posts` - सभी ब्लॉग पोस्ट्स प्राप्त करें
- `GET /api/blog-posts/active` - सभी एक्टिव ब्लॉग पोस्ट्स प्राप्त करें
- `GET /api/blog-posts/featured` - फीचर्ड ब्लॉग पोस्ट्स प्राप्त करें

### प्रोजेक्ट्स

- `GET /api/projects` - सभी प्रोजेक्ट्स प्राप्त करें
- `GET /api/projects/active` - सभी एक्टिव प्रोजेक्ट्स प्राप्त करें
- `GET /api/projects/featured` - फीचर्ड प्रोजेक्ट्स प्राप्त करें

## ऑथेंटिकेशन

कुछ API एंडपॉइंट्स JWT ऑथेंटिकेशन की आवश्यकता करते हैं। टोकन प्राप्त करने के लिए:

```
POST /api/users/login
```

रिक्वेस्ट बॉडी:

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

प्राप्त टोकन को `Authorization` हेडर में `Bearer` प्रीफिक्स के साथ भेजें:

```
Authorization: Bearer your-token-here
```