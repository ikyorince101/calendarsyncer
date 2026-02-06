import { CalendarAccount, EmailAccount, CalendarEvent } from '../types';
import { GoogleCalendarService } from './GoogleCalendarService';
import { OutlookCalendarService } from './OutlookCalendarService';
import { EmailService } from './EmailService';

/**
 * Centralized service for synchronizing all calendar sources
 */
export class SyncService {
  /**
   * Sync all calendar accounts and return aggregated events
   */
  static async syncCalendarAccounts(accounts: CalendarAccount[]): Promise<CalendarEvent[]> {
    const enabledAccounts = accounts.filter(acc => acc.enabled);
    
    const promises = enabledAccounts.map(async (account) => {
      try {
        switch (account.type) {
          case 'google':
            return await GoogleCalendarService.fetchEvents(account);
          case 'outlook':
            return await OutlookCalendarService.fetchEvents(account);
          default:
            console.warn(`Unknown account type: ${account.type}`);
            return [];
        }
      } catch (error) {
        console.error(`Error syncing ${account.type} account ${account.email}:`, error);
        // Return empty array on error to allow other accounts to sync
        return [];
      }
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  /**
   * Sync email accounts and extract events
   */
  static async syncEmailAccounts(emailAccounts: EmailAccount[]): Promise<CalendarEvent[]> {
    const enabledAccounts = emailAccounts.filter(acc => acc.enabled);
    
    const promises = enabledAccounts.map(async (account) => {
      try {
        return await EmailService.fetchAndParseEmails(account);
      } catch (error) {
        console.error(`Error parsing emails from ${account.email}:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  /**
   * Sync all sources (calendars and emails)
   */
  static async syncAll(
    calendarAccounts: CalendarAccount[],
    emailAccounts: EmailAccount[]
  ): Promise<CalendarEvent[]> {
    try {
      const [calendarEvents, emailEvents] = await Promise.all([
        this.syncCalendarAccounts(calendarAccounts),
        this.syncEmailAccounts(emailAccounts),
      ]);

      // Combine all events
      const allEvents = [...calendarEvents, ...emailEvents];

      // Remove duplicates based on title and start time
      const uniqueEvents = this.removeDuplicates(allEvents);

      // Sort by start time
      return uniqueEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
    } catch (error) {
      console.error('Error during sync:', error);
      throw error;
    }
  }

  /**
   * Remove duplicate events
   */
  private static removeDuplicates(events: CalendarEvent[]): CalendarEvent[] {
    const seen = new Set<string>();
    return events.filter(event => {
      const key = `${event.title}-${event.start.getTime()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Create an event in the appropriate calendar service
   */
  static async createEvent(
    account: CalendarAccount,
    event: Partial<CalendarEvent>
  ): Promise<CalendarEvent> {
    switch (account.type) {
      case 'google':
        return await GoogleCalendarService.createEvent(account, event);
      case 'outlook':
        return await OutlookCalendarService.createEvent(account, event);
      default:
        throw new Error(`Cannot create event for account type: ${account.type}`);
    }
  }

  /**
   * Validate account credentials
   */
  static async validateAccount(account: CalendarAccount): Promise<boolean> {
    try {
      // Try to fetch a small number of events to validate the account
      const events = await (account.type === 'google' 
        ? GoogleCalendarService.fetchEvents(account)
        : OutlookCalendarService.fetchEvents(account));
      return true;
    } catch (error) {
      console.error('Account validation failed:', error);
      return false;
    }
  }
}
