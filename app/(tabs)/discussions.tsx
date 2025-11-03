
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '@/i18n/config';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  isGroup: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Alice Martin',
    lastMessage: 'Salut ! Comment vas-tu ?',
    timestamp: '10:30',
    unreadCount: 2,
    avatar: '👩',
    isOnline: true,
    isGroup: false,
  },
  {
    id: '2',
    name: 'Équipe Développement',
    lastMessage: 'La réunion est à 15h',
    timestamp: '09:15',
    unreadCount: 5,
    avatar: '👥',
    isOnline: false,
    isGroup: true,
  },
  {
    id: '3',
    name: 'Bob Dupont',
    lastMessage: 'Merci pour ton aide !',
    timestamp: 'Hier',
    unreadCount: 0,
    avatar: '👨',
    isOnline: false,
    isGroup: false,
  },
  {
    id: '4',
    name: 'Sophie Laurent',
    lastMessage: 'À bientôt 👋',
    timestamp: 'Hier',
    unreadCount: 0,
    avatar: '👩‍💼',
    isOnline: true,
    isGroup: false,
  },
  {
    id: '5',
    name: 'Projet FortressTalk',
    lastMessage: 'Nouvelle fonctionnalité ajoutée',
    timestamp: 'Lundi',
    unreadCount: 0,
    avatar: '🔒',
    isOnline: false,
    isGroup: true,
  },
];

export default function DiscussionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: Conversation }) => (
    <Pressable
      style={({ pressed }) => [
        styles.conversationItem,
        pressed && styles.conversationItemPressed,
      ]}
      onPress={() => router.push(`/chat/${item.id}?name=${encodeURIComponent(item.name)}`)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {item.isGroup && (
        <View style={styles.groupIndicator}>
          <IconSymbol name="person.2.fill" size={12} color={colors.textSecondary} />
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: i18n.t('discussions.title'),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => console.log('New conversation')}
              style={styles.headerButton}
            >
              <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t('discussions.search')}
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

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="chat.bubble" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>{i18n.t('discussions.empty')}</Text>
            <Text style={styles.emptySubtext}>
              {i18n.t('discussions.emptySubtext')}
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
    marginVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  conversationItemPressed: {
    backgroundColor: colors.card,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  groupIndicator: {
    marginLeft: 8,
  },
  headerButton: {
    padding: 4,
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
