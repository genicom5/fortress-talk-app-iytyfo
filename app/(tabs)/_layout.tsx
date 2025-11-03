
import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'discussions',
      route: '/(tabs)/discussions',
      icon: 'chat.bubble.fill',
      label: 'Discussions',
    },
    {
      name: 'calls',
      route: '/(tabs)/calls',
      icon: 'phone.fill',
      label: 'Appels',
    },
    {
      name: 'contacts',
      route: '/(tabs)/contacts',
      icon: 'person.2.fill',
      label: 'Contacts',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'gear',
      label: 'Paramètres',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="discussions" />
        <Stack.Screen name="calls" />
        <Stack.Screen name="contacts" />
        <Stack.Screen name="settings" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={340} />
    </>
  );
}
