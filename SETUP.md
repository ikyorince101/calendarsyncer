# Setup Guide for Calendar Syncer

This guide will walk you through setting up the Calendar Syncer application for development and production.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - Install globally: `npm install -g expo-cli`

### For Mobile Development

#### iOS
- **macOS** (required for iOS development)
- **Xcode** (latest version) - [Download from Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - `sudo gem install cocoapods`

#### Android
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** (via Android Studio)
- **Java Development Kit (JDK)** 11 or higher

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ikyorince101/calendarsyncer.git
cd calendarsyncer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- Navigation libraries
- Calendar components
- API clients

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your API credentials (see sections below for obtaining these).

### 4. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You'll see a QR code in the terminal.

### 5. Run on Device/Simulator

Choose your platform:

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web
npm run web
```

Or use the Expo Go app on your mobile device to scan the QR code.

## OAuth Setup

### Google Calendar Integration

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project"
   - Name it "Calendar Syncer" and create

2. **Enable Google Calendar API**
   - In the project dashboard, go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose application type:
     - For mobile: iOS/Android
     - For web: Web application
   - Add authorized redirect URIs:
     - For web: `http://localhost:19006/auth/callback`
     - For mobile: Use your app's deep link scheme

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in application name and support email
   - Add scopes: `https://www.googleapis.com/auth/calendar.readonly`
   - Add test users (for development)

5. **Add Credentials to App**
   - Copy the Client ID and Client Secret
   - Add to `.env`:
     ```
     GOOGLE_CLIENT_ID=your_client_id_here
     GOOGLE_CLIENT_SECRET=your_client_secret_here
     ```

### Outlook/Office 365 Integration

1. **Register an Application in Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com/)
   - Navigate to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Name: "Calendar Syncer"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"

2. **Configure Platform**
   - In your app registration, go to "Authentication"
   - Click "Add a platform"
   - Choose your platform (Mobile/Desktop or Web)
   - Add redirect URIs:
     - For mobile: `msauth.com.calendarsyncer.app://auth`
     - For web: `http://localhost:19006/auth/callback`

3. **Add API Permissions**
   - Go to "API permissions"
   - Click "Add a permission"
   - Choose "Microsoft Graph"
   - Select "Delegated permissions"
   - Add: `Calendars.Read`, `Calendars.ReadWrite`
   - Click "Grant admin consent" (if you have admin rights)

4. **Create Client Secret**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description and choose expiration
   - Copy the secret value immediately (you won't see it again)

5. **Add Credentials to App**
   - Copy the Application (client) ID and secret
   - Add to `.env`:
     ```
     MICROSOFT_CLIENT_ID=your_client_id_here
     MICROSOFT_CLIENT_SECRET=your_client_secret_here
     ```

## Email Configuration

### Gmail IMAP Setup

For Gmail accounts, you need to enable "Less secure app access" or use App Passwords:

1. **Enable IMAP**
   - Go to Gmail Settings > Forwarding and POP/IMAP
   - Enable IMAP

2. **Create App Password** (Recommended)
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Go to "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in the app

3. **IMAP Settings**
   - Host: `imap.gmail.com`
   - Port: `993`
   - Security: SSL/TLS

### Outlook IMAP Setup

1. **Enable IMAP**
   - Go to Outlook Settings > Mail > Sync email
   - Enable IMAP

2. **IMAP Settings**
   - Host: `outlook.office365.com`
   - Port: `993`
   - Security: SSL/TLS
   - Use your Microsoft account email and password

### Backend Service (Recommended)

For production, it's recommended to use a backend service to handle email connections:

1. Create a simple Node.js backend
2. Use `imapflow` or similar library to connect to email servers
3. Expose an API endpoint for the mobile app to call
4. Store credentials securely on the backend

Example backend code:

```javascript
// backend/emailParser.js
const { ImapFlow } = require('imapflow');

async function fetchEmails(config) {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  await client.connect();
  
  // Fetch recent emails
  const lock = await client.getMailboxLock('INBOX');
  try {
    // Fetch logic here
  } finally {
    lock.release();
  }
  
  await client.logout();
}
```

## Building for Production

### Web

```bash
npm run build:web
```

Deploy the `web-build` directory to your hosting service (Netlify, Vercel, etc.).

### iOS

1. Install Expo EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

4. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

### Android

1. Build for Android:
   ```bash
   eas build --platform android
   ```

2. Submit to Play Store:
   ```bash
   eas submit --platform android
   ```

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Run `npm install` again
- Clear cache: `npm start --clear`

**OAuth redirect not working**
- Check redirect URIs match exactly
- Ensure proper URL schemes are configured

**IMAP connection fails**
- Verify credentials
- Check firewall/network settings
- Ensure IMAP is enabled in email settings

**Expo app not loading**
- Ensure phone and computer are on same network
- Try restarting the Expo development server

### Debug Mode

Enable debug logging:

```javascript
// In App.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
}
```

## Testing

### Unit Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] Add Google Calendar account
- [ ] Add Outlook account
- [ ] Add email account
- [ ] View events in calendar
- [ ] Sync events manually
- [ ] Test on different screen sizes
- [ ] Test offline functionality
- [ ] Test error handling

## Next Steps

After setup:

1. Test the OAuth flow with test accounts
2. Customize the UI to match your branding
3. Add additional features as needed
4. Set up analytics and monitoring
5. Configure push notifications
6. Implement proper error tracking (Sentry, etc.)

## Support

For issues and questions:
- Check the [README.md](README.md)
- Review the [ARCHITECTURE.md](ARCHITECTURE.md)
- Open an issue on GitHub

## Security Notes

- Never commit `.env` file to version control
- Use secure storage for sensitive data
- Rotate OAuth credentials regularly
- Implement proper error handling to avoid exposing credentials
- Use HTTPS for all API communications
