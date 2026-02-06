export interface CalendarEvent {
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

export interface CalendarAccount {
  id: string;
  type: 'google' | 'outlook';
  email: string;
  displayName: string;
  accessToken?: string;
  refreshToken?: string;
  enabled: boolean;
}

export interface EmailAccount {
  id: string;
  email: string;
  protocol: 'imap' | 'pop3';
  host: string;
  port: number;
  username: string;
  password: string;
  enabled: boolean;
}

export interface EmailEvent {
  subject: string;
  body: string;
  from: string;
  date: Date;
  detectedEvent?: CalendarEvent;
}
