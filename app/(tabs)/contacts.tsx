
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import i18n from '@/i18n/config';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Martin',
    avatar: '👩',
    status: 'online',
    lastSeen: 'En ligne',
  },
  {
    id: '2',
    name: 'Bob Dupont',
    avatar: '👨',
    status: 'offline',
    lastSeen: 'Vu il y a 2h',
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    avatar: '👩‍💼',
    status: 'online',
    lastSeen: 'En ligne',
  },
  {
    id: '4',
    name: 'Marc Dubois',
    avatar: '👨‍💼',
    status: 'away',
    lastSeen: 'Absent',
  },
  {
    id: '5',
    name: 'Emma Bernard',
    avatar: '👩‍🦰',
    status: 'offline',
    lastSeen: 'Vu hier',
  },
  {
    id: '6',
    name: 'Lucas Petit',
    avatar: '👨‍🦱',
    status: 'online',
    lastSeen: 'En ligne',
  },
];

export default function ContactsScreen() {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return colors.online;
      case 'away':
        return colors.away;
      default:
        return colors.offline;
    }
  };

  const handleAddContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      i18n.t('contacts.addContact'),
      i18n.t('contacts.addContactMessage'),
      [
        { text: i18n.t('contacts.cancel'), style: 'cancel' },
        { text: i18n.t('contacts.add'), onPress: () => console.log('Add contact') },
      ]
    );
  };

  const handleContactPress = (contact: Contact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      contact.name,
      i18n.t('contacts.contactOptions'),
      [
        { text: i18n.t('contacts.sendMessage'), onPress: () => console.log('Message') },
        { text: i18n.t('contacts.call'), onPress: () => console.log('Call') },
        { text: i18n.t('contacts.viewProfile'), onPress: () => console.log('Profile') },
        { text: i18n.t('contacts.cancel'), style: 'cancel' },
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <Pressable
      style={({ pressed }) => [
        styles.contactItem,
        pressed && styles.contactItemPressed,
      ]}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
      </View>

      <View style={styles.contactContent}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.lastSeen}>{item.lastSeen}</Text>
      </View>

      <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: i18n.t('contacts.title'),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={handleAddContact} style={styles.headerButton}>
              <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t('contacts.search')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{contacts.length}</Text>
          <Text style={styles.statLabel}>{i18n.t('contacts.contactsCount')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {contacts.filter((c) => c.status === 'online').length}
          </Text>
          <Text style={styles.statLabel}>{i18n.t('contacts.onlineCount')}</Text>
        </View>
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="person.2" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{i18n.t('contacts.empty')}</Text>
            <Text style={styles.emptySubtext}>
              {i18n.t('contacts.emptySubtext')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  contactItemPressed: {
    backgroundColor: colors.card,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 26,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.background,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
