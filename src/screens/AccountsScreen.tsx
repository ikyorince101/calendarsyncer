import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useCalendar } from '../context/CalendarContext';
import { CalendarAccount, EmailAccount } from '../types';

export default function AccountsScreen() {
  const { accounts, emailAccounts, addAccount, removeAccount, addEmailAccount, removeEmailAccount } = useCalendar();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [accountType, setAccountType] = useState<'google' | 'outlook'>('google');
  
  // Email account form state
  const [emailForm, setEmailForm] = useState({
    email: '',
    protocol: 'imap' as 'imap' | 'pop3',
    host: '',
    port: '993',
    username: '',
    password: '',
  });

  const handleAddCalendarAccount = async (type: 'google' | 'outlook') => {
    try {
      // In production, this would trigger OAuth flow
      Alert.alert(
        'OAuth Required',
        `To connect ${type === 'google' ? 'Google' : 'Outlook'} Calendar, you need to authenticate via OAuth. This requires proper OAuth configuration.`,
        [
          {
            text: 'Add Demo Account',
            onPress: () => {
              const newAccount: CalendarAccount = {
                id: `${type}-${Date.now()}`,
                type,
                email: `demo@${type}.com`,
                displayName: `Demo ${type} Account`,
                enabled: true,
              };
              addAccount(newAccount);
              setShowAddModal(false);
              Alert.alert('Success', 'Demo account added');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add account');
    }
  };

  const handleAddEmailAccount = () => {
    if (!emailForm.email || !emailForm.host || !emailForm.username || !emailForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAccount: EmailAccount = {
      id: `email-${Date.now()}`,
      email: emailForm.email,
      protocol: emailForm.protocol,
      host: emailForm.host,
      port: parseInt(emailForm.port),
      username: emailForm.username,
      password: emailForm.password,
      enabled: true,
    };

    addEmailAccount(newAccount);
    setShowEmailModal(false);
    setEmailForm({
      email: '',
      protocol: 'imap',
      host: '',
      port: '993',
      username: '',
      password: '',
    });
    Alert.alert('Success', 'Email account added');
  };

  const handleRemoveAccount = (id: string, type: 'calendar' | 'email') => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove this account? All associated events will be removed.',
      [
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (type === 'calendar') {
              removeAccount(id);
            } else {
              removeEmailAccount(id);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Calendar Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Calendar Accounts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {accounts.length === 0 && (
            <Text style={styles.emptyText}>No calendar accounts connected</Text>
          )}

          {accounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountType}>
                  {account.type === 'google' ? '📅 Google Calendar' : '📅 Outlook Calendar'}
                </Text>
                <Text style={styles.accountEmail}>{account.email}</Text>
                <Text style={styles.accountName}>{account.displayName}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAccount(account.id, 'calendar')}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Email Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Email Accounts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowEmailModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {emailAccounts.length === 0 && (
            <Text style={styles.emptyText}>No email accounts configured</Text>
          )}

          {emailAccounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountType}>
                  📧 {account.protocol.toUpperCase()} Account
                </Text>
                <Text style={styles.accountEmail}>{account.email}</Text>
                <Text style={styles.accountName}>
                  {account.host}:{account.port}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAccount(account.id, 'email')}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Calendar Account Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Calendar Account</Text>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.googleButton]}
              onPress={() => handleAddCalendarAccount('google')}
            >
              <Text style={styles.modalButtonText}>Connect Google Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.outlookButton]}
              onPress={() => handleAddCalendarAccount('outlook')}
            >
              <Text style={styles.modalButtonText}>Connect Outlook Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Email Account Modal */}
      <Modal
        visible={showEmailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Email Account</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={emailForm.email}
              onChangeText={(text) => setEmailForm({ ...emailForm, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="IMAP/POP3 Host (e.g., imap.gmail.com)"
              value={emailForm.host}
              onChangeText={(text) => setEmailForm({ ...emailForm, host: text })}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Port (e.g., 993)"
              value={emailForm.port}
              onChangeText={(text) => setEmailForm({ ...emailForm, port: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={emailForm.username}
              onChangeText={(text) => setEmailForm({ ...emailForm, username: text })}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={emailForm.password}
              onChangeText={(text) => setEmailForm({ ...emailForm, password: text })}
              secureTextEntry
            />

            <View style={styles.protocolSelector}>
              <TouchableOpacity
                style={[
                  styles.protocolButton,
                  emailForm.protocol === 'imap' && styles.protocolButtonActive,
                ]}
                onPress={() => setEmailForm({ ...emailForm, protocol: 'imap' })}
              >
                <Text style={emailForm.protocol === 'imap' ? styles.protocolTextActive : styles.protocolText}>
                  IMAP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.protocolButton,
                  emailForm.protocol === 'pop3' && styles.protocolButtonActive,
                ]}
                onPress={() => setEmailForm({ ...emailForm, protocol: 'pop3' })}
              >
                <Text style={emailForm.protocol === 'pop3' ? styles.protocolTextActive : styles.protocolText}>
                  POP3
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAddEmailAccount}
            >
              <Text style={styles.modalButtonText}>Add Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEmailModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 30,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  outlookButton: {
    backgroundColor: '#0078D4',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  protocolSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  protocolButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  protocolButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  protocolText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  protocolTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
