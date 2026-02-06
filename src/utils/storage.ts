import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCOUNTS: 'calendar_accounts',
  EMAIL_ACCOUNTS: 'email_accounts',
  EVENTS: 'calendar_events',
  SETTINGS: 'app_settings',
};

/**
 * Storage utility for persisting data
 */
export class StorageService {
  /**
   * Save data to storage
   */
  static async save<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  /**
   * Load data from storage
   */
  static async load<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return null;
    }
  }

  /**
   * Remove data from storage
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get storage keys
   */
  static get keys() {
    return STORAGE_KEYS;
  }
}
