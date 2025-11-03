
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import i18n from '@/i18n/config';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  isRead: boolean;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Salut ! Comment vas-tu ?',
    timestamp: new Date(Date.now() - 3600000),
    isSent: false,
    isRead: true,
    type: 'text',
  },
  {
    id: '2',
    text: 'Ça va bien merci ! Et toi ?',
    timestamp: new Date(Date.now() - 3500000),
    isSent: true,
    isRead: true,
    type: 'text',
  },
  {
    id: '3',
    text: 'Super ! Tu es disponible pour un appel ?',
    timestamp: new Date(Date.now() - 3400000),
    isSent: false,
    isRead: true,
    type: 'text',
  },
  {
    id: '4',
    text: 'Oui, je suis là. On peut discuter maintenant.',
    timestamp: new Date(Date.now() - 3300000),
    isSent: true,
    isRead: true,
    type: 'text',
  },
];

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const contactName = typeof name === 'string' ? decodeURIComponent(name) : 'Contact';

  useEffect(() => {
    // Simulate typing indicator
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date(),
      isSent: true,
      isRead: false,
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate typing indicator from other user
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleCall = (isVideo: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const callType = isVideo ? 'vidéo' : 'audio';
    Alert.alert(
      isVideo ? i18n.t('chat.videoCall') : i18n.t('chat.audioCall'),
      i18n.t('chat.callFeatureMessage', { type: callType }),
      [{ text: i18n.t('chat.ok') }]
    );
  };

  const handleAttachment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      i18n.t('chat.shareFile'),
      i18n.t('chat.chooseFileType'),
      [
        { text: i18n.t('chat.photo'), onPress: () => console.log('Photo selected') },
        { text: i18n.t('chat.file'), onPress: () => console.log('File selected') },
        { text: i18n.t('chat.audio'), onPress: () => console.log('Audio selected') },
        { text: i18n.t('chat.cancel'), style: 'cancel' },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          {item.isSent && (
            <IconSymbol
              name={item.isRead ? 'checkmark.circle.fill' : 'checkmark.circle'}
              size={14}
              color={item.isRead ? colors.accent : colors.textSecondary}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: contactName,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => handleCall(false)}
                style={styles.headerButton}
              >
                <IconSymbol name="phone.fill" size={22} color={colors.primary} />
              </Pressable>
              <Pressable
                onPress={() => handleCall(true)}
                style={styles.headerButton}
              >
                <IconSymbol name="video.fill" size={22} color={colors.primary} />
              </Pressable>
            </View>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Pressable onPress={handleAttachment} style={styles.attachButton}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </Pressable>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('chat.message')}
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
          </View>

          <Pressable
            onPress={sendMessage}
            style={[
              styles.sendButton,
              inputText.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            disabled={inputText.trim().length === 0}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={inputText.trim().length > 0 ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sentBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  attachButton: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    minHeight: 36,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
