import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: '万年历',
                    tabBarIcon: ({color}) => <Ionicons name="calendar" size={28} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: '排盘',
                    tabBarIcon: ({color}) => <Ionicons name="analytics" size={28} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="my"
                options={{
                    title: '我的',
                    tabBarIcon: ({color}) => <Ionicons name="person" size={28} color={color}/>,
                }}
            />
        </Tabs>
    );
}
