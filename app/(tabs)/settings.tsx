
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [e2eeEnabled, setE2eeEnabled] = useState(true);
  const [autoDeleteMessages, setAutoDeleteMessages] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleToggle = (
    value: boolean,
    setter: (value: boolean) => void,
    feature: string
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
    console.log(`${feature} toggled:`, value);
  };

  const handleServerConfig = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Configuration du serveur',
      'Connectez-vous à votre serveur Fortress Cloud Privée ou à un serveur auto-hébergé.\n\nCette fonctionnalité nécessite un backend configuré.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'À propos de FortressTalk',
      'FortressTalk v1.0.0\n\nApplication de messagerie privée sécurisée\n\n🔒 Chiffrement de bout en bout\n📱 Appels audio et vidéo\n💬 Messagerie instantanée\n🔐 Auto-hébergement possible\n\nDéveloppé avec React Native + Expo',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.settingIcon}>
        <IconSymbol name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (showChevron && (
        <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
      ))}
    </Pressable>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Paramètres',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>Utilisateur</Text>
          <Text style={styles.profileStatus}>En ligne</Text>
          <Pressable
            style={styles.editProfileButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Modifier le profil', 'Fonctionnalité à venir');
            }}
          >
            <Text style={styles.editProfileText}>Modifier le profil</Text>
          </Pressable>
        </View>

        {/* Appearance */}
        <SectionHeader title="APPARENCE" />
        <View style={styles.section}>
          <SettingItem
            icon="moon.fill"
            title="Mode sombre"
            subtitle="Activé par défaut"
            showChevron={false}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={(value) => handleToggle(value, setDarkMode, 'Dark mode')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text}
              />
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="NOTIFICATIONS" />
        <View style={styles.section}>
          <SettingItem
            icon="bell.fill"
            title="Notifications"
            subtitle="Recevoir des notifications push"
            showChevron={false}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={(value) =>
                  handleToggle(value, setNotifications, 'Notifications')
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text}
              />
            }
          />
          <SettingItem
            icon="speaker.wave.2.fill"
            title="Sons"
            subtitle="Sons de notification"
            onPress={() => Alert.alert('Sons', 'Configuration des sons')}
          />
        </View>

        {/* Security */}
        <SectionHeader title="SÉCURITÉ ET CONFIDENTIALITÉ" />
        <View style={styles.section}>
          <SettingItem
            icon="lock.shield.fill"
            title="Chiffrement E2EE"
            subtitle="Chiffrement de bout en bout activé"
            showChevron={false}
            rightElement={
              <Switch
                value={e2eeEnabled}
                onValueChange={(value) => handleToggle(value, setE2eeEnabled, 'E2EE')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text}
              />
            }
          />
          <SettingItem
            icon="faceid"
            title="Authentification biométrique"
            subtitle="Empreinte digitale ou Face ID"
            showChevron={false}
            rightElement={
              <Switch
                value={biometricAuth}
                onValueChange={(value) =>
                  handleToggle(value, setBiometricAuth, 'Biometric auth')
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text}
              />
            }
          />
          <SettingItem
            icon="timer"
            title="Suppression automatique"
            subtitle="Supprimer les messages après un délai"
            showChevron={false}
            rightElement={
              <Switch
                value={autoDeleteMessages}
                onValueChange={(value) =>
                  handleToggle(value, setAutoDeleteMessages, 'Auto-delete')
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text}
              />
            }
          />
        </View>

        {/* Server */}
        <SectionHeader title="SERVEUR" />
        <View style={styles.section}>
          <SettingItem
            icon="server.rack"
            title="Configuration du serveur"
            subtitle="Fortress Cloud Privée ou auto-hébergé"
            onPress={handleServerConfig}
          />
          <SettingItem
            icon="link"
            title="Lien d&apos;invitation"
            subtitle="Partager un lien d&apos;invitation"
            onPress={() => Alert.alert('Lien d\'invitation', 'Générer un lien')}
          />
        </View>

        {/* About */}
        <SectionHeader title="À PROPOS" />
        <View style={styles.section}>
          <SettingItem
            icon="info.circle.fill"
            title="À propos de FortressTalk"
            subtitle="Version 1.0.0"
            onPress={handleAbout}
          />
          <SettingItem
            icon="doc.text.fill"
            title="Conditions d&apos;utilisation"
            onPress={() => Alert.alert('Conditions', 'Conditions d\'utilisation')}
          />
          <SettingItem
            icon="hand.raised.fill"
            title="Politique de confidentialité"
            onPress={() => Alert.alert('Confidentialité', 'Politique de confidentialité')}
          />
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert(
              'Déconnexion',
              'Êtes-vous sûr de vouloir vous déconnecter ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Déconnexion', style: 'destructive', onPress: () => console.log('Logout') },
              ]
            );
          }}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  scrollContentWithTabBar: {
    paddingBottom: 120,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 16,
    color: colors.online,
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemPressed: {
    backgroundColor: colors.background,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
