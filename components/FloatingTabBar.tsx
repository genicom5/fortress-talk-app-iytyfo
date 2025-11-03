
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = 340,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();

  const activeIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    const newIndex = tabs.findIndex((tab) => pathname.includes(tab.name));
    if (newIndex >= 0) {
      indicatorPosition.value = withSpring(newIndex, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [pathname, tabs]);

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    router.push(route);
  };

  const tabWidth = containerWidth / tabs.length;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        <BlurView
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
          style={[styles.blurContainer, { borderRadius }]}
        >
          <View style={styles.tabBar}>
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: tabWidth,
                  backgroundColor: theme.dark
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.08)',
                  borderRadius: borderRadius - 5,
                },
                animatedIndicatorStyle,
              ]}
            />
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.name);
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.tab, { width: tabWidth }]}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon}
                    size={24}
                    color={
                      isActive
                        ? colors.primary
                        : theme.dark
                        ? colors.textSecondary
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isActive
                          ? colors.primary
                          : theme.dark
                          ? colors.textSecondary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    height: 70,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    left: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
