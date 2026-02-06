# Backend Service for Email Parsing

Since React Native cannot directly use Node.js libraries like `imapflow` and `mailparser`, a backend service is required for email parsing functionality.

## Backend Setup

### Option 1: Simple Node.js Backend

Create a separate Node.js backend service:

```bash
mkdir backend
cd backend
npm init -y
npm install express imapflow mailparser cors dotenv
```

### Sample Backend Code

**`backend/server.js`:**

```javascript
const express = require('express');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to fetch and parse emails
app.post('/api/parse-emails', async (req, res) => {
  const { host, port, username, password } = req.body;

  try {
    const client = new ImapFlow({
      host,
      port,
      secure: true,
      auth: {
        user: username,
        pass: password
      },
      logger: false
    });

    await client.connect();

    // Select inbox
    const lock = await client.getMailboxLock('INBOX');
    
    try {
      // Search for recent unread emails
      const messages = await client.search({ seen: false }, { uid: true });
      const events = [];

      // Fetch each message
      for (const uid of messages.slice(0, 10)) { // Limit to 10 emails
        const message = await client.fetchOne(uid, { source: true });
        const parsed = await simpleParser(message.source);
        
        // Extract event information
        const event = parseEmailForEvent(parsed.subject, parsed.text);
        if (event) {
          events.push(event);
        }
      }

      lock.release();
      await client.logout();

      res.json({ success: true, events });
    } catch (error) {
      lock.release();
      throw error;
    }
  } catch (error) {
    console.error('Error parsing emails:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Email parsing logic (same as React Native version)
function parseEmailForEvent(subject, body) {
  // Implementation here...
  // (Use the same logic from src/utils/emailParser.ts)
  return null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

**`backend/package.json`:**

```json
{
  "name": "calendarsyncer-backend",
  "version": "1.0.0",
  "description": "Backend service for Calendar Syncer email parsing",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "imapflow": "^1.0.158",
    "mailparser": "^3.6.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Running the Backend

```bash
cd backend
npm install
npm start
```

### Update React Native App

Update `src/services/EmailService.ts` to call the backend:

```typescript
static async fetchAndParseEmails(account: EmailAccount): Promise<CalendarEvent[]> {
  try {
    const response = await fetch('http://localhost:3000/api/parse-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: account.host,
        port: account.port,
        username: account.username,
        password: account.password,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return data.events;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
```

## Option 2: Serverless Function

Deploy as serverless function (AWS Lambda, Vercel, Netlify):

**`api/parse-emails.js`:**

```javascript
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { host, port, username, password } = req.body;

  try {
    // Same implementation as above
    // ...
    
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

## Option 3: Firebase Cloud Functions

```javascript
const functions = require('firebase-functions');
const { ImapFlow } = require('imapflow');

exports.parseEmails = functions.https.onRequest(async (req, res) => {
  // Same implementation
});
```

## Security Considerations

1. **Never store credentials in the app**
   - Use environment variables
   - Encrypt credentials at rest
   - Use OAuth when possible

2. **Secure the API**
   - Add authentication (API keys, JWT)
   - Rate limiting
   - HTTPS only

3. **Validate inputs**
   - Sanitize email account parameters
   - Validate email addresses and hosts
   - Prevent injection attacks

## Deployment

### Docker

**`backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**

```bash
docker build -t calendarsyncer-backend .
docker run -p 3000:3000 calendarsyncer-backend
```

### Environment Variables

**`.env`:**

```
PORT=3000
ALLOWED_ORIGINS=http://localhost:19006,https://your-app.com
```

## Testing the Backend

```bash
# Test the endpoint
curl -X POST http://localhost:3000/api/parse-emails \
  -H "Content-Type: application/json" \
  -d '{
    "host": "imap.gmail.com",
    "port": 993,
    "username": "your@email.com",
    "password": "your_app_password"
  }'
```

## Production Deployment

1. Deploy backend to:
   - Heroku
   - AWS EC2/ECS
   - Google Cloud Run
   - DigitalOcean App Platform

2. Update React Native app with production API URL

3. Enable HTTPS

4. Set up monitoring and logging

## Alternative: Push-based Email Processing

Instead of polling emails, use push notifications:

1. Set up email forwarding rules
2. Forward to a webhook URL
3. Parse emails as they arrive
4. Push events to mobile app via push notifications

This is more efficient and provides real-time event creation.
