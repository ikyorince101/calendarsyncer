# Quick Start Guide

Get Calendar Syncer up and running in minutes!

## 🚀 Installation

### Option 1: Quick Start (Development)

```bash
# Clone the repository
git clone https://github.com/ikyorince101/calendarsyncer.git
cd calendarsyncer

# Install dependencies
npm install

# Start the development server
npm start
```

Then:
- Press `w` to run in web browser
- Press `i` to run on iOS simulator (Mac only)
- Press `a` to run on Android emulator
- Scan QR code with Expo Go app on your phone

### Option 2: With OAuth Setup (Full Features)

For complete functionality including Google Calendar and Outlook sync, follow the [SETUP.md](SETUP.md) guide to configure OAuth credentials.

## 📱 Platform-Specific Launch

### Web
```bash
npm run web
```
Opens at `http://localhost:19006`

### iOS (Requires Mac + Xcode)
```bash
npm run ios
```

### Android (Requires Android Studio)
```bash
npm run android
```

## 🎯 First Time Setup

### 1. Launch the App
After starting, you'll see the home screen with an empty calendar.

### 2. Add a Calendar Account
1. Tap **"Accounts"** button
2. Tap **"+ Add"** under Calendar Accounts
3. Choose Google or Outlook
4. For demo purposes, tap **"Add Demo Account"**
5. Return to home screen

### 3. View Your Calendar
The home screen displays:
- 📅 Monthly calendar view
- 📍 Events for selected date
- 📊 Statistics

### 4. Configure Email (Optional)
1. Go to **Accounts**
2. Tap **"+ Add"** under Email Accounts
3. Enter your email server details:
   - Email: your@email.com
   - Host: imap.gmail.com (for Gmail)
   - Port: 993
   - Username: your@email.com
   - Password: your app password

## 🎨 Interface Overview

### Home Screen
- **Calendar**: Tap any date to view events
- **Events List**: Shows events for selected date
- **Pull to Refresh**: Sync latest events
- **Color Coding**:
  - 🔵 Blue = Google Calendar
  - 🔵 Dark Blue = Outlook
  - 🟢 Green = Email Events

### Accounts Screen
- View all connected accounts
- Add new accounts
- Remove accounts
- Enable/disable accounts

### Settings Screen
- Auto Sync toggle
- Email parsing toggle
- Push notifications
- App information

## 🔧 Configuration

### For Gmail IMAP:
```
Host: imap.gmail.com
Port: 993
Security: SSL/TLS
```

You'll need to:
1. Enable IMAP in Gmail settings
2. Generate an App Password (recommended)
3. Use the app password instead of your regular password

### For Outlook IMAP:
```
Host: outlook.office365.com
Port: 993
Security: SSL/TLS
```

## ⚡ Features Overview

### ✅ Multi-Account Support
Connect multiple Google and Outlook accounts simultaneously.

### ✅ Email Event Extraction
Automatically detect calendar events in your emails.

### ✅ Unified View
See all events from all sources in one calendar.

### ✅ Cross-Platform
Works on iOS, Android, and Web.

## 🧪 Testing the App

### Add a Demo Event

Since the demo accounts don't have OAuth configured, you can test by:

1. Modifying the `CalendarContext.tsx` to add sample events:

```typescript
const [events, setEvents] = useState<CalendarEvent[]>([
  {
    id: 'demo-1',
    title: 'Team Meeting',
    start: new Date(2024, 1, 15, 14, 0),
    end: new Date(2024, 1, 15, 15, 0),
    location: 'Conference Room A',
    source: 'google',
    accountId: 'demo-account',
    description: 'Discuss project progress'
  }
]);
```

2. Refresh the app to see the demo event

## 📖 Learn More

- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [API.md](API.md) - API documentation

## 🐛 Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules
npm install
npm start --clear
```

### App won't start
```bash
# Clear cache
npm start -- --clear

# Or reset completely
expo start -c
```

### OAuth not working
- Verify credentials in `.env`
- Check redirect URIs match exactly
- Ensure OAuth consent screen is configured

### Email connection fails
- Verify IMAP/POP3 is enabled
- Check credentials
- Try using an app-specific password
- Check firewall/network settings

## 💡 Tips

1. **Use Demo Mode**: Start with demo accounts to explore features
2. **Test Locally**: Use web version for faster development
3. **Check Console**: Look for helpful debug messages
4. **Hot Reload**: Changes auto-reload in development mode
5. **Use Expo Go**: Easy mobile testing without builds

## 🔐 Security Notes

- Never commit `.env` file
- Use app-specific passwords for email
- OAuth tokens are stored in memory (not persisted in demo mode)
- For production, implement secure token storage

## 🎓 Next Steps

1. ✅ Get the app running
2. 📚 Read the full [SETUP.md](SETUP.md) guide
3. 🔑 Configure OAuth for real calendar access
4. 🧪 Explore the codebase
5. 🚀 Build your own features

## 📞 Need Help?

- Check existing [Issues](../../issues)
- Read the [Documentation](README.md)
- Open a new issue if needed

## 🎉 You're Ready!

Calendar Syncer is now running. Start exploring, testing, and building!

---

**Estimated Time to Get Started**: 5-10 minutes  
**Estimated Time for Full OAuth Setup**: 30-60 minutes
