import axios from 'axios';
import { CalendarEvent, CalendarAccount } from '../types';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export class GoogleCalendarService {
  /**
   * Authenticate with Google OAuth 2.0
   * In a real implementation, this would use expo-auth-session or similar
   */
  static async authenticate(): Promise<{ accessToken: string; refreshToken: string }> {
    // Placeholder for OAuth flow
    // Real implementation would use:
    // - expo-auth-session for mobile
    // - Google OAuth 2.0 flow for web
    throw new Error('OAuth authentication needs to be implemented with actual OAuth flow');
  }

  /**
   * Fetch events from Google Calendar
   */
  static async fetchEvents(account: CalendarAccount): Promise<CalendarEvent[]> {
    if (!account.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.get(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
        params: {
          maxResults: 100,
          singleEvents: true,
          orderBy: 'startTime',
          timeMin: new Date().toISOString(),
        },
      });

      return response.data.items.map((item: any) => ({
        id: item.id,
        title: item.summary || 'Untitled',
        description: item.description,
        start: new Date(item.start.dateTime || item.start.date),
        end: new Date(item.end.dateTime || item.end.date),
        location: item.location,
        source: 'google' as const,
        accountId: account.id,
        color: item.colorId,
      }));
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      throw error;
    }
  }

  /**
   * Create an event in Google Calendar
   */
  static async createEvent(account: CalendarAccount, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    if (!account.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.post(
        `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
        {
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.start?.toISOString(),
          },
          end: {
            dateTime: event.end?.toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        }
      );

      return {
        id: response.data.id,
        title: response.data.summary,
        description: response.data.description,
        start: new Date(response.data.start.dateTime),
        end: new Date(response.data.end.dateTime),
        location: response.data.location,
        source: 'google',
        accountId: account.id,
      };
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<string> {
    // Placeholder for token refresh
    // Real implementation would call Google's token endpoint
    throw new Error('Token refresh needs to be implemented');
  }
}
