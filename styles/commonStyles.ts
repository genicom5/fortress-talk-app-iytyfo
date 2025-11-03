
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Color palette for FortressTalk
export const colors = {
  // Primary colors
  primary: '#0A84FF', // Blue
  primaryDark: '#0066CC',
  
  // Background colors
  background: '#000000', // Dark background
  backgroundLight: '#F2F2F7', // Light background
  card: '#1C1C1E', // Dark card
  cardLight: '#FFFFFF', // Light card
  
  // Text colors
  text: '#FFFFFF', // White text
  textLight: '#000000', // Black text for light mode
  textSecondary: '#8E8E93', // Gray text
  
  // Accent colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Border colors
  border: '#2C2C2E',
  borderLight: '#D8D8DC',
  
  // Status colors
  online: '#34C759',
  offline: '#8E8E93',
  away: '#FF9500',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
