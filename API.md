# API Documentation

This document describes the APIs and services used in Calendar Syncer.

## Table of Contents
- [Google Calendar API](#google-calendar-api)
- [Microsoft Graph API (Outlook)](#microsoft-graph-api-outlook)
- [Email Services (IMAP/POP3)](#email-services-imappop3)
- [Internal Services](#internal-services)

---

## Google Calendar API

### Overview
Google Calendar API v3 is used to read and write calendar events from Google Calendar accounts.

### Base URL
```
https://www.googleapis.com/calendar/v3
```

### Authentication
Uses OAuth 2.0 with the following scopes:
- `https://www.googleapis.com/auth/calendar.readonly` - Read calendar events
- `https://www.googleapis.com/auth/calendar` - Read and write calendar events

### Endpoints Used

#### List Events
```
GET /calendars/{calendarId}/events
```

**Parameters:**
- `maxResults`: Number of events to return (default: 100)
- `singleEvents`: Expand recurring events (default: true)
- `orderBy`: Sort order (startTime)
- `timeMin`: Lower bound for event start time (ISO 8601)

**Response:**
```json
{
  "items": [
    {
      "id": "event_id",
      "summary": "Event title",
      "description": "Event description",
      "start": {
        "dateTime": "2024-01-15T14:00:00Z"
      },
      "end": {
        "dateTime": "2024-01-15T15:00:00Z"
      },
      "location": "Conference Room A"
    }
  ]
}
```

#### Create Event
```
POST /calendars/{calendarId}/events
```

**Request Body:**
```json
{
  "summary": "Event title",
  "description": "Event description",
  "start": {
    "dateTime": "2024-01-15T14:00:00Z"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00Z"
  },
  "location": "Conference Room A"
}
```

### Rate Limits
- 1,000,000 queries per day
- 10 queries per second per user

### Error Handling
- **401 Unauthorized**: Invalid or expired token - trigger re-authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Calendar not found
- **429 Too Many Requests**: Rate limit exceeded - implement exponential backoff

---

## Microsoft Graph API (Outlook)

### Overview
Microsoft Graph API is used to access Outlook/Office 365 calendar data.

### Base URL
```
https://graph.microsoft.com/v1.0
```

### Authentication
Uses OAuth 2.0 with the following permissions:
- `Calendars.Read` - Read user calendars
- `Calendars.ReadWrite` - Read and write user calendars

### Endpoints Used

#### List Events
```
GET /me/calendar/events
```

**Parameters:**
- `$top`: Number of events to return (default: 100)
- `$orderby`: Sort order (start/dateTime)
- `$filter`: Filter events (e.g., by date range)

**Response:**
```json
{
  "value": [
    {
      "id": "event_id",
      "subject": "Event title",
      "bodyPreview": "Event description",
      "start": {
        "dateTime": "2024-01-15T14:00:00",
        "timeZone": "UTC"
      },
      "end": {
        "dateTime": "2024-01-15T15:00:00",
        "timeZone": "UTC"
      },
      "location": {
        "displayName": "Conference Room A"
      }
    }
  ]
}
```

#### Create Event
```
POST /me/calendar/events
```

**Request Body:**
```json
{
  "subject": "Event title",
  "body": {
    "contentType": "HTML",
    "content": "Event description"
  },
  "start": {
    "dateTime": "2024-01-15T14:00:00",
    "timeZone": "UTC"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00",
    "timeZone": "UTC"
  },
  "location": {
    "displayName": "Conference Room A"
  }
}
```

### Rate Limits
- Varies by subscription type
- Typically 10,000 requests per 10 minutes

### Error Handling
- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Calendar or event not found
- **429 Too Many Requests**: Rate limit exceeded

---

## Email Services (IMAP/POP3)

### IMAP (Internet Message Access Protocol)

**Purpose:** Access and parse emails for event extraction

**Common Ports:**
- 143 (unencrypted)
- 993 (SSL/TLS)

**Configuration Example:**
```javascript
{
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: 'user@gmail.com',
    pass: 'app_password'
  }
}
```

### POP3 (Post Office Protocol)

**Purpose:** Download emails for local processing

**Common Ports:**
- 110 (unencrypted)
- 995 (SSL/TLS)

### Email Parsing

The app parses email content to extract:
1. **Dates**: Various formats (MM/DD/YYYY, YYYY-MM-DD, Month Day, Year)
2. **Times**: 12-hour and 24-hour formats
3. **Locations**: Pattern matching for location indicators
4. **Event titles**: Email subject line

**Patterns Detected:**
```javascript
// Date patterns
/(\d{1,2}\/\d{1,2}\/\d{4})/g
/(\d{4}-\d{2}-\d{2})/g
/(January|February|...|December)\s+\d{1,2},?\s+\d{4}/gi

// Time patterns
/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/gi

// Location patterns
/(?:at|@|location:?)\s+([^\n,.]+)/gi
```

---

## Internal Services

### SyncService

Central service for coordinating synchronization across all sources.

#### Methods

**`syncAll(calendarAccounts, emailAccounts)`**
- Syncs all calendar and email accounts
- Returns: `Promise<CalendarEvent[]>`

**`syncCalendarAccounts(accounts)`**
- Syncs only calendar accounts (Google, Outlook)
- Returns: `Promise<CalendarEvent[]>`

**`syncEmailAccounts(emailAccounts)`**
- Parses emails for events
- Returns: `Promise<CalendarEvent[]>`

**`createEvent(account, event)`**
- Creates an event in the specified calendar
- Returns: `Promise<CalendarEvent>`

### GoogleCalendarService

**`authenticate()`**
- Initiates OAuth flow
- Returns: `Promise<{ accessToken, refreshToken }>`

**`fetchEvents(account)`**
- Fetches events from Google Calendar
- Returns: `Promise<CalendarEvent[]>`

**`createEvent(account, event)`**
- Creates event in Google Calendar
- Returns: `Promise<CalendarEvent>`

### OutlookCalendarService

**`authenticate()`**
- Initiates Microsoft OAuth flow
- Returns: `Promise<{ accessToken, refreshToken }>`

**`fetchEvents(account)`**
- Fetches events from Outlook Calendar
- Returns: `Promise<CalendarEvent[]>`

**`createEvent(account, event)`**
- Creates event in Outlook Calendar
- Returns: `Promise<CalendarEvent>`

### EmailService

**`fetchAndParseEmails(account)`**
- Connects to email server and extracts events
- Returns: `Promise<CalendarEvent[]>`

**`parseEmailForEvent(subject, body)`**
- Parses email content for event information
- Returns: `CalendarEvent | null`

### StorageService

**`save(key, data)`**
- Saves data to AsyncStorage
- Returns: `Promise<void>`

**`load(key)`**
- Loads data from AsyncStorage
- Returns: `Promise<T | null>`

**`remove(key)`**
- Removes data from AsyncStorage
- Returns: `Promise<void>`

---

## Data Types

### CalendarEvent
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  source: 'google' | 'outlook' | 'email';
  accountId: string;
  color?: string;
}
```

### CalendarAccount
```typescript
interface CalendarAccount {
  id: string;
  type: 'google' | 'outlook';
  email: string;
  displayName: string;
  accessToken?: string;
  refreshToken?: string;
  enabled: boolean;
}
```

### EmailAccount
```typescript
interface EmailAccount {
  id: string;
  email: string;
  protocol: 'imap' | 'pop3';
  host: string;
  port: number;
  username: string;
  password: string;
  enabled: boolean;
}
```

---

## Best Practices

### API Call Optimization
1. **Batch Requests**: Combine multiple operations when possible
2. **Caching**: Cache responses for frequently accessed data
3. **Incremental Sync**: Use `timeMin` parameter to fetch only new events
4. **Pagination**: Process large datasets in chunks

### Error Handling
1. **Retry Logic**: Implement exponential backoff for transient errors
2. **Token Refresh**: Automatically refresh expired OAuth tokens
3. **User Feedback**: Display meaningful error messages to users
4. **Logging**: Log errors for debugging and monitoring

### Security
1. **Secure Storage**: Use platform-specific secure storage for tokens
2. **HTTPS Only**: All API calls must use HTTPS
3. **Token Expiration**: Handle token expiration gracefully
4. **Input Validation**: Validate all user inputs before API calls

---

## Testing APIs

### Using cURL

**Google Calendar:**
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10"
```

**Microsoft Graph:**
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "https://graph.microsoft.com/v1.0/me/calendar/events?$top=10"
```

### Using Postman

Import the API endpoints into Postman and configure OAuth 2.0 authentication for testing.

---

## Rate Limit Management

### Strategy
1. Track API call count
2. Implement request queuing
3. Use exponential backoff on rate limit errors
4. Cache responses to reduce API calls

### Example Implementation
```javascript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  
  async add(fn: () => Promise<any>) {
    this.queue.push(fn);
    if (!this.processing) {
      await this.process();
    }
  }
  
  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      try {
        await fn();
        await this.delay(100); // Rate limit: 10 req/sec
      } catch (error) {
        if (error.status === 429) {
          await this.delay(5000); // Backoff on rate limit
          this.queue.unshift(fn); // Retry
        }
      }
    }
    this.processing = false;
  }
  
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/api/overview)
- [IMAP Protocol Specification](https://tools.ietf.org/html/rfc3501)
- [OAuth 2.0 Specification](https://oauth.net/2/)
