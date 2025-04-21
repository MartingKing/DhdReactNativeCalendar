import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {Stack, useRouter} from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";
import dayjs from "dayjs";
import {HeaderBackButton} from "@react-navigation/elements";
import ModalConfirm from "@/app/components/ModalConfirm";
import {Ionicons} from "@expo/vector-icons";

export default function BirthDayReminderScreen() {
    const [reminders, setReminders] = useState<BirthdayReminder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [delId, setDeleteId] = useState('');
    const isFocused = useIsFocused();
    const router = useRouter();
    useEffect(() => {
        const loadReminders = async () => {
            const stored = await AsyncStorage.getItem('birthdayReminders');
            if (stored) setReminders(JSON.parse(stored));
        };
        loadReminders().then(r => "");
    }, [isFocused]);

    const calculateDaysLeft = (dateString: string) => {
        const today = dayjs().startOf('day');
        let birthday = dayjs(dateString).year(dayjs().year());

        if (birthday.isBefore(today)) {
            birthday = birthday.add(1, 'year');
        }

        const daysLeft = birthday.diff(today, 'day');

        if (daysLeft === 0) return '🎉 今天';
        return `${daysLeft} 天`;
    };

    const handlePress = () => {
        router.push({
            // @ts-ignore
            pathname: 'pages/AddReminder',
        });
    };
    const handleDelete = async (id: string) => {
        const filtered = reminders.filter(r => r.id !== id);
        setReminders(filtered);
        await AsyncStorage.setItem('birthdayReminders', JSON.stringify(filtered));
    };

    const handleItemPress = (item: BirthdayReminder) => {
        console.log("item click")
        setShowModal(true);
        setDeleteId(item.id)
    };
    const handleConfirm = () => {
        console.log('执行确认操作');
        setShowModal(false);
        handleDelete(delId).then(r => console.log('delete'))
    };

    const handleCancel = () => {
        console.log('取消操作');
        setShowModal(false);
    };
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: '生日列表',
                    headerTintColor: 'black',
                    headerStyle: {
                        backgroundColor: 'red', // 标题栏背景设为白色
                    },
                    headerTitleStyle: {
                        color: 'black', // 单独设置标题颜色
                    },
                    headerTitleAlign: 'center',
                    headerLeft: (props) => (
                        <HeaderBackButton
                            {...props}
                            onPress={() => router.back()}
                            // 以下是可选的自定义样式
                            style={styles.backButton}
                            tintColor="#000" // 与 headerTintColor 保持一致
                        />
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handlePress}
                            style={styles.headerButton}
                        >
                            <Text style={styles.headerButtonText}>+</Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => handleItemPress(item)} // 添加点击事件
                        activeOpacity={0.7} // 点击时的透明度效果
                    >
                        <View style={styles.reminderItem}>
                            <Ionicons name="gift" size={40} color="#FF4081"/>
                            <View style={styles.reminderContent}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text
                                    style={styles.date}>{item.solarDate} {item.lunarDate}</Text>
                            </View>
                            <Text style={styles.daysLeft}>
                                {calculateDaysLeft(item.solarDate)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <ModalConfirm
                visible={showModal}
                title="删除确认"
                content="确定要删除这条记录吗？"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmText="确认删除"
                cancelText="取消"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reminderItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    reminderContent: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    daysLeft: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4081',
        marginLeft: 16,
    },
    container: {
        backgroundColor: '#ede1e1',
        flex: 1,
    },
    deleteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerButton: {
        marginRight: 16,
        paddingHorizontal: 8,
    },
    headerButtonText: {
        fontSize: 24,
        color: 'black', // 保持与标题颜色一致
    },
    backButton: {
        marginLeft: Platform.select({
            ios: -8,    // iOS 系统默认间距调整
            android: 0
        })
    }
});
