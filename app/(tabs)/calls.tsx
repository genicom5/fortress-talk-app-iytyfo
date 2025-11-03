
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface CallHistory {
  id: string;
  name: string;
  avatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration: string;
}

const mockCallHistory: CallHistory[] = [
  {
    id: '1',
    name: 'Alice Martin',
    avatar: '👩',
    type: 'video',
    direction: 'outgoing',
    timestamp: "Aujourd'hui, 10:30",
    duration: '15:23',
  },
  {
    id: '2',
    name: 'Bob Dupont',
    avatar: '👨',
    type: 'audio',
    direction: 'incoming',
    timestamp: "Aujourd'hui, 09:15",
    duration: '8:45',
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    avatar: '👩‍💼',
    type: 'video',
    direction: 'missed',
    timestamp: 'Hier, 18:20',
    duration: '',
  },
  {
    id: '4',
    name: 'Équipe Développement',
    avatar: '👥',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Hier, 15:00',
    duration: '45:12',
  },
  {
    id: '5',
    name: 'Alice Martin',
    avatar: '👩',
    type: 'audio',
    direction: 'outgoing',
    timestamp: 'Lundi, 14:30',
    duration: '5:30',
  },
];

export default function CallsScreen() {
  const [callHistory, setCallHistory] = useState(mockCallHistory);

  const handleCall = (name: string, type: 'audio' | 'video') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      `Appel ${type === 'video' ? 'vidéo' : 'audio'}`,
      `Appeler ${name}...\n\nCette fonctionnalité nécessite WebRTC et un serveur backend pour fonctionner. Elle sera disponible dans une future version.`,
      [{ text: 'OK' }]
    );
  };

  const getCallIcon = (item: CallHistory) => {
    if (item.direction === 'missed') {
      return 'phone.down.fill';
    }
    return item.direction === 'incoming' ? 'phone.arrow.down.left' : 'phone.arrow.up.right';
  };

  const getCallColor = (direction: string) => {
    if (direction === 'missed') return colors.error;
    return colors.textSecondary;
  };

  const renderCallItem = ({ item }: { item: CallHistory }) => (
    <Pressable
      style={({ pressed }) => [
        styles.callItem,
        pressed && styles.callItemPressed,
      ]}
      onPress={() => handleCall(item.name, item.type)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>

      <View style={styles.callContent}>
        <Text style={styles.callName}>{item.name}</Text>
        <View style={styles.callInfo}>
          <IconSymbol
            name={getCallIcon(item)}
            size={14}
            color={getCallColor(item.direction)}
          />
          <Text style={[styles.callTimestamp, { color: getCallColor(item.direction) }]}>
            {item.timestamp}
          </Text>
          {item.duration && (
            <>
              <Text style={styles.callDot}>•</Text>
              <Text style={styles.callDuration}>{item.duration}</Text>
            </>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => handleCall(item.name, item.type)}
        style={styles.callButton}
      >
        <IconSymbol
          name={item.type === 'video' ? 'video.fill' : 'phone.fill'}
          size={20}
          color={colors.primary}
        />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Appels',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.infoCard}>
        <IconSymbol name="info.circle.fill" size={24} color={colors.accent} />
        <Text style={styles.infoText}>
          Les appels audio et vidéo nécessitent WebRTC et un serveur backend. Cette fonctionnalité sera disponible prochainement.
        </Text>
      </View>

      <FlatList
        data={callHistory}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="phone" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Aucun appel</Text>
            <Text style={styles.emptySubtext}>
              Votre historique d&apos;appels apparaîtra ici
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  callItemPressed: {
    backgroundColor: colors.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTimestamp: {
    fontSize: 14,
  },
  callDot: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
