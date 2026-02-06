import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarEvent } from '../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const getSourceColor = () => {
    switch (event.source) {
      case 'google':
        return '#4285F4';
      case 'outlook':
        return '#0078D4';
      case 'email':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.indicator, { backgroundColor: getSourceColor() }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            🕐 {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
          </Text>
        </View>

        {event.location && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {event.location}
          </Text>
        )}

        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.source}>
            {event.source.toUpperCase()}
          </Text>
          <Text style={styles.date}>
            {format(event.start, 'MMM d, yyyy')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
