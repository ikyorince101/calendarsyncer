import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CalendarEvent, CalendarAccount, EmailAccount } from '../types';

interface CalendarContextType {
  events: CalendarEvent[];
  accounts: CalendarAccount[];
  emailAccounts: EmailAccount[];
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  addAccount: (account: CalendarAccount) => void;
  removeAccount: (id: string) => void;
  updateAccount: (id: string, updates: Partial<CalendarAccount>) => void;
  addEmailAccount: (account: EmailAccount) => void;
  removeEmailAccount: (id: string) => void;
  syncEvents: () => Promise<void>;
  loading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accounts, setAccounts] = useState<CalendarAccount[]>([]);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const addEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addAccount = (account: CalendarAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    // Remove events from this account
    setEvents(prev => prev.filter(e => e.accountId !== id));
  };

  const updateAccount = (id: string, updates: Partial<CalendarAccount>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addEmailAccount = (account: EmailAccount) => {
    setEmailAccounts(prev => [...prev, account]);
  };

  const removeEmailAccount = (id: string) => {
    setEmailAccounts(prev => prev.filter(a => a.id !== id));
  };

  const syncEvents = async () => {
    setLoading(true);
    try {
      // This will be implemented with actual API calls
      // For now, it's a placeholder
      console.log('Syncing events...');
    } catch (error) {
      console.error('Error syncing events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        accounts,
        emailAccounts,
        addEvent,
        removeEvent,
        addAccount,
        removeAccount,
        updateAccount,
        addEmailAccount,
        removeEmailAccount,
        syncEvents,
        loading,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
