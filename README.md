# Calendar Syncer

A cross-platform calendar synchronization application built with React Native and Expo. Sync events from multiple Google Calendar and Outlook/Office 365 accounts, extract events from emails, and view everything in a unified calendar interface.

## Features

### 🗓️ Multi-Account Calendar Sync
- Connect multiple Google Calendar accounts
- Connect multiple Outlook/Office 365 accounts
- Synchronize events from all connected accounts
- View events in a unified calendar interface

### 📧 Email Event Extraction
- Scan emails via IMAP/POP3
- Automatically detect and parse calendar events from email content
- Extract dates, times, and locations from emails
- Create calendar events from detected information

### 📱 Cross-Platform Support
- **Mobile**: iOS and Android via React Native
- **Desktop**: Web application
- Consistent experience across all platforms

### 🎨 Unified Calendar View
- Single calendar displaying all events from all sources
- Color-coded events by source (Google, Outlook, Email)
- Event details with time, location, and description
- Statistics dashboard showing total events and connected accounts

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Calendar UI**: react-native-calendars
- **Date Handling**: date-fns
- **HTTP Client**: axios
- **State Management**: React Context API
- **Storage**: AsyncStorage

## Installation

### Prerequisites
- Node.js 14+ and npm
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode and CocoaPods
- For Android: Android Studio

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ikyorince101/calendarsyncer.git
cd calendarsyncer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Platform-Specific Commands

- **iOS**: `npm run ios` (requires Mac with Xcode)
- **Android**: `npm run android` (requires Android Studio)
- **Web**: `npm run web`

## Project Structure

```
calendarsyncer/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context for state management
│   │   └── CalendarContext.tsx
│   ├── screens/             # Application screens
│   │   ├── HomeScreen.tsx
│   │   ├── AccountsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/            # API and service integrations
│   │   ├── GoogleCalendarService.ts
│   │   ├── OutlookCalendarService.ts
│   │   └── EmailService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
│       └── emailParser.ts
├── App.tsx                  # Main application component
├── index.js                 # Entry point
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Configuration

### Google Calendar Integration

To enable Google Calendar sync, you need to:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure the OAuth consent screen
5. Add the credentials to your application

### Outlook/Office 365 Integration

To enable Outlook Calendar sync, you need to:

1. Register an application in [Azure Portal](https://portal.azure.com/)
2. Configure Microsoft Graph API permissions
3. Set up OAuth 2.0 authentication
4. Add the credentials to your application

### Email (IMAP/POP3) Configuration

For email event extraction:

1. Navigate to the Accounts screen
2. Click "Add" under Email Accounts
3. Enter your email credentials:
   - Email address
   - IMAP/POP3 host (e.g., imap.gmail.com)
   - Port (e.g., 993 for IMAP)
   - Username
   - Password
   - Protocol (IMAP or POP3)

**Note**: For security reasons, consider using a backend service to handle email connections instead of storing credentials on the client.

## Usage

### Adding Calendar Accounts

1. Open the app and navigate to "Accounts"
2. Click "Add" under Calendar Accounts
3. Choose Google Calendar or Outlook Calendar
4. Complete the OAuth authentication flow
5. Your calendar will be synced automatically

### Viewing Events

1. The home screen displays a calendar with all your events
2. Events are marked with colored dots based on their source:
   - 🔵 Blue: Google Calendar
   - 🔵 Dark Blue: Outlook Calendar
   - 🟢 Green: Email-extracted events
3. Tap a date to view events for that day
4. Pull down to refresh and sync new events

### Email Event Extraction

1. Add an email account in the Accounts screen
2. The app will scan your emails for potential events
3. Detected events will appear in your calendar
4. Events are parsed from email content using natural language processing

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production

#### Web
```bash
npm run build:web
```

#### iOS
```bash
expo build:ios
```

#### Android
```bash
expo build:android
```

## Security Considerations

- OAuth tokens should be stored securely using platform-specific secure storage
- Email credentials should ideally be handled by a backend service
- Never commit API keys or secrets to version control
- Use environment variables for sensitive configuration

## Limitations

- Direct IMAP/POP3 connections from mobile apps are not recommended for security
- OAuth authentication requires proper configuration in Google/Microsoft consoles
- Email event extraction uses pattern matching and may not catch all events
- Some features require a backend service for production use

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.