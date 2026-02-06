import { CalendarEvent } from '../types';
import { parse } from 'date-fns';

/**
 * Parse email content to extract calendar event information
 * This is a simplified implementation. In production, use more sophisticated NLP
 */
export function parseEventFromEmail(subject: string, body: string): CalendarEvent | null {
  // Common patterns for event detection
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{4})/g, // MM/DD/YYYY
    /(\d{4}-\d{2}-\d{2})/g, // YYYY-MM-DD
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
  ];

  const timePatterns = [
    /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/gi,
    /(\d{1,2}:\d{2})/g,
  ];

  const locationPatterns = [
    /(?:at|@|location:?)\s+([^\n,.]+)/gi,
    /(?:venue:?)\s+([^\n,.]+)/gi,
  ];

  // Extract potential dates
  let dates: string[] = [];
  datePatterns.forEach(pattern => {
    const matches = body.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  });

  // Extract potential times
  let times: string[] = [];
  timePatterns.forEach(pattern => {
    const matches = body.match(pattern);
    if (matches) {
      times.push(...matches);
    }
  });

  // Extract potential locations
  let locations: string[] = [];
  locationPatterns.forEach(pattern => {
    const matches = [...body.matchAll(pattern)];
    if (matches) {
      locations.push(...matches.map(m => m[1]?.trim()).filter(Boolean));
    }
  });

  // If we found at least a date, try to create an event
  if (dates.length > 0) {
    try {
      // Try to parse date with date-fns for consistent handling
      let startDate: Date;
      const dateStr = dates[0];
      
      // Try different date formats
      if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        // ISO format YYYY-MM-DD
        startDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      } else if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
        // Assume MM/DD/YYYY format (US standard)
        startDate = parse(dateStr, 'MM/dd/yyyy', new Date());
      } else {
        // Try parsing as natural language date
        startDate = new Date(dateStr);
      }
      
      // Validate the parsed date
      if (isNaN(startDate.getTime())) {
        console.warn('Invalid date parsed:', dateStr);
        return null;
      }
      
      // If we have a time, try to set it
      if (times.length > 0) {
        const timeMatch = times[0].match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const meridiem = timeMatch[3]?.toUpperCase();
          
          if (meridiem === 'PM' && hours < 12) hours += 12;
          if (meridiem === 'AM' && hours === 12) hours = 0;
          
          startDate.setHours(hours, minutes, 0, 0);
        }
      }

      // Default end time is 1 hour after start
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      return {
        id: `email-${Date.now()}-${Math.random()}`,
        title: subject,
        description: body.substring(0, 500), // First 500 chars
        start: startDate,
        end: endDate,
        location: locations[0] || undefined,
        source: 'email',
        accountId: 'email-parsed',
      };
    } catch (error) {
      console.error('Error parsing event from email:', error);
      return null;
    }
  }

  return null;
}

/**
 * Check if an email likely contains event information
 */
export function isLikelyEvent(subject: string, body: string): boolean {
  const eventKeywords = [
    'meeting', 'conference', 'appointment', 'event', 'reminder',
    'invitation', 'rsvp', 'schedule', 'calendar', 'date', 'time'
  ];

  const text = `${subject} ${body}`.toLowerCase();
  return eventKeywords.some(keyword => text.includes(keyword));
}

/**
 * Extract contact information from email
 */
export function extractContactInfo(body: string): { email?: string; phone?: string } {
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
  const phonePattern = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

  const emails = body.match(emailPattern);
  const phones = body.match(phonePattern);

  return {
    email: emails?.[0],
    phone: phones?.[0],
  };
}
