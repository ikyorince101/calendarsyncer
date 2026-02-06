import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendar } from '../context/CalendarContext';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }: any) {
  const { events, accounts, loading, syncEvents } = useCalendar();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await syncEvents();
    setRefreshing(false);
  };

  // Convert events to calendar marked dates
  const markedDates = events.reduce((acc, event) => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    const color = event.source === 'google' ? '#4285F4' : event.source === 'outlook' ? '#0078D4' : '#10B981';
    
    if (!acc[dateKey]) {
      acc[dateKey] = { marked: true, dots: [{ color }] };
    } else {
      acc[dateKey].dots.push({ color });
    }
    return acc;
  }, {} as any);

  // Add selection to marked dates
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#6366F1',
    };
  }

  // Filter events for selected date
  const selectedDateEvents = events.filter(
    event => format(event.start, 'yyyy-MM-dd') === selectedDate
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar Syncer</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Accounts')}
          >
            <Text style={styles.buttonText}>Accounts ({accounts.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Calendar
          markingType={'multi-dot'}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            selectedDayBackgroundColor: '#6366F1',
            todayTextColor: '#6366F1',
            arrowColor: '#6366F1',
          }}
        />

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            Events for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </Text>
          
          {loading && <ActivityIndicator size="large" color="#6366F1" />}
          
          {!loading && selectedDateEvents.length === 0 && (
            <Text style={styles.noEvents}>No events for this date</Text>
          )}

          {selectedDateEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={[
                styles.eventIndicator,
                { backgroundColor: event.source === 'google' ? '#4285F4' : event.source === 'outlook' ? '#0078D4' : '#10B981' }
              ]} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </Text>
                {event.location && (
                  <Text style={styles.eventLocation}>📍 {event.location}</Text>
                )}
                {event.description && (
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                )}
                <Text style={styles.eventSource}>
                  Source: {event.source.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{events.length}</Text>
              <Text style={styles.statLabel}>Total Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{accounts.length}</Text>
              <Text style={styles.statLabel}>Connected Accounts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  eventsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111827',
  },
  noEvents: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 30,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  eventSource: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  statsSection: {
    padding: 20,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
});
