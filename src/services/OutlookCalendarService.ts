import axios from 'axios';
import { CalendarEvent, CalendarAccount } from '../types';

const MICROSOFT_GRAPH_API = 'https://graph.microsoft.com/v1.0';

export class OutlookCalendarService {
  /**
   * Authenticate with Microsoft OAuth 2.0
   */
  static async authenticate(): Promise<{ accessToken: string; refreshToken: string }> {
    // Placeholder for OAuth flow
    // Real implementation would use:
    // - expo-auth-session for mobile
    // - Microsoft OAuth 2.0 flow for web
    throw new Error('OAuth authentication needs to be implemented with actual OAuth flow');
  }

  /**
   * Fetch events from Outlook Calendar
   */
  static async fetchEvents(account: CalendarAccount): Promise<CalendarEvent[]> {
    if (!account.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.get(`${MICROSOFT_GRAPH_API}/me/calendar/events`, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
        params: {
          $top: 100,
          $orderby: 'start/dateTime',
          $filter: `start/dateTime ge '${new Date().toISOString()}'`,
        },
      });

      return response.data.value.map((item: any) => ({
        id: item.id,
        title: item.subject || 'Untitled',
        description: item.bodyPreview,
        start: new Date(item.start.dateTime),
        end: new Date(item.end.dateTime),
        location: item.location?.displayName,
        source: 'outlook' as const,
        accountId: account.id,
      }));
    } catch (error) {
      console.error('Error fetching Outlook Calendar events:', error);
      throw error;
    }
  }

  /**
   * Create an event in Outlook Calendar
   */
  static async createEvent(account: CalendarAccount, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    if (!account.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios.post(
        `${MICROSOFT_GRAPH_API}/me/calendar/events`,
        {
          subject: event.title,
          body: {
            contentType: 'HTML',
            content: event.description || '',
          },
          start: {
            dateTime: event.start?.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: event.end?.toISOString(),
            timeZone: 'UTC',
          },
          location: {
            displayName: event.location || '',
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
        title: response.data.subject,
        description: response.data.bodyPreview,
        start: new Date(response.data.start.dateTime),
        end: new Date(response.data.end.dateTime),
        location: response.data.location?.displayName,
        source: 'outlook',
        accountId: account.id,
      };
    } catch (error) {
      console.error('Error creating Outlook Calendar event:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<string> {
    // Placeholder for token refresh
    throw new Error('Token refresh needs to be implemented');
  }
}
