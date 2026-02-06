import { parseEventFromEmail, isLikelyEvent } from '../src/utils/emailParser';

describe('Email Parser', () => {
  describe('parseEventFromEmail', () => {
    it('should extract event from email with clear date and time', () => {
      const subject = 'Team Meeting Tomorrow';
      const body = `
        Hi team,
        
        We have a meeting scheduled for January 15, 2024 at 2:00 PM.
        Location: Conference Room A
        
        See you there!
      `;

      const event = parseEventFromEmail(subject, body);
      
      expect(event).not.toBeNull();
      expect(event?.title).toBe(subject);
      expect(event?.location).toContain('Conference Room A');
      expect(event?.source).toBe('email');
    });

    it('should handle emails without dates', () => {
      const subject = 'General Update';
      const body = 'This is just a general email with no event information.';

      const event = parseEventFromEmail(subject, body);
      
      expect(event).toBeNull();
    });

    it('should extract date in MM/DD/YYYY format', () => {
      const subject = 'Project Deadline';
      const body = 'The project deadline is 12/25/2024 at 3:30 PM';

      const event = parseEventFromEmail(subject, body);
      
      expect(event).not.toBeNull();
      expect(event?.title).toBe(subject);
    });

    it('should extract date in YYYY-MM-DD format', () => {
      const subject = 'Conference Call';
      const body = 'Conference call scheduled for 2024-06-15 at 10:00 AM';

      const event = parseEventFromEmail(subject, body);
      
      expect(event).not.toBeNull();
    });

    it('should handle multiple dates and use the first one', () => {
      const subject = 'Event Rescheduled';
      const body = 'The event was moved from January 10, 2024 to January 15, 2024 at 2:00 PM';

      const event = parseEventFromEmail(subject, body);
      
      expect(event).not.toBeNull();
    });
  });

  describe('isLikelyEvent', () => {
    it('should identify emails with event keywords', () => {
      expect(isLikelyEvent('Meeting Invitation', 'Join us for a meeting')).toBe(true);
      expect(isLikelyEvent('Conference RSVP', 'Please RSVP for the conference')).toBe(true);
      expect(isLikelyEvent('Appointment Reminder', 'Your appointment is tomorrow')).toBe(true);
    });

    it('should reject emails without event keywords', () => {
      expect(isLikelyEvent('Newsletter', 'Here is our weekly newsletter')).toBe(false);
      expect(isLikelyEvent('Update', 'Just a general update')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isLikelyEvent('MEETING', 'PLEASE JOIN THE MEETING')).toBe(true);
      expect(isLikelyEvent('meeting', 'please join the meeting')).toBe(true);
    });
  });
});
