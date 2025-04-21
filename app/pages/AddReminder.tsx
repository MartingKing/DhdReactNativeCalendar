import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import {Stack, useRouter} from "expo-router";
import CalendarModal from "@/app/components/CalendarModal";
import {formatDate, formatTimeUnit, getChineseHour, getHours} from "@/app/Utils/DhdUtils";
import TimePickerModal from "@/app/components/TimePickerModal";
import PushNotification from "react-native-push-notification";
import dayjs from "dayjs";
import LunarPicker from "@/app/components/LunarPicker";
import RadioGroup from "@/app/components/RadioGroup";
import {Lunar, Solar} from "lunar-typescript";
import GenderPicker from "@/app/components/GenderPicker";
import SolarDatePickerModal from "@/app/components/SolarDatePickerModal";


export default function AddReminderScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const today = new Date();
    const initialDate = formatDate(today);
    const [selected, setSelected] = useState(initialDate);
    const [selectedLunar, setSelectedLunar] = useState<Lunar>();
    const [showPicker, setShowPicker] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState('00:00:00');
    const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    const scheduleNotification = (dateString: string, time: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so we add 1
        const day = date.getDate();

        // 使用 dayjs 解析时间
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;

        // 创建带有时分秒的通知时间对象
        let notifyTime = dayjs(new Date(year, month - 1, day, hours, minutes, seconds))
            .year(dayjs().year()) // 设置为当前年份
            .second(0);// 确保秒数为 0（如果 time 参数没有秒）

        // 如果时间已经过去，延后一年
        if (notifyTime.isBefore(dayjs())) {
            notifyTime = notifyTime.add(1, 'year');
        }

        // 调试输出
        console.log('预定通知时间:', notifyTime.format('YYYY-MM-DD HH:mm:ss'));

        PushNotification.localNotificationSchedule({
            title: `生日提醒：${title}`,
            message: description || '记得送上祝福哦～',
            date: notifyTime.toDate(), // 转换为 JavaScript Date 对象
            repeatType: 'hour', // 可选：当天每个小时提醒一次
        });

    };

    const handleSave = async () => {
        const isLunar = calendarType === 'lunar';
        let lunarDate = ""
        let solarDate = ''
        if (isLunar) {
            lunarDate = selectedLunar?.getYearInChinese() + "年" + selectedLunar?.getMonthInChinese() + "月" + selectedLunar?.getDayInChinese() + " " + getChineseHour(Number(getHours(selectedTime)))
            const lunarMonth = selectedLunar?.getMonth()
            const solar = selectedLunar?.getSolar();
            const solarMonth = solar?.getMonth()
            //以下为年份纠偏，getSolar的时候年份可能有误
            let year = solar?.getYear().toString().length === 4 ? solar?.getYear() : selectedLunar?.getYear()
            // @ts-ignore
            if (solarMonth < lunarMonth && year < 12) {
                // @ts-ignore
                year = year + 1
            }
            solarDate = year + "-" + solar?.getMonth() + "-" + solar?.getDay() + " " + selectedTime
        } else {
            solarDate = selected + " " + selectedTime;
            let split = selected.split("-");
            let solarFromSelected = Solar.fromYmd(Number(split[0]), Number(split[1]), Number(split[2]));
            let lunarFromSelected = solarFromSelected.getLunar();
            lunarDate = lunarFromSelected.getYearInChinese() + "年" + lunarFromSelected.getMonthInChinese() + "月" + lunarFromSelected.getDayInChinese() + " " + getChineseHour(Number(getHours(selectedTime)))
        }
        const newReminder = {
            id: uuidv4(),
            title,
            description,
            solarDate: solarDate,
            lunarDate: lunarDate,
            gender: gender,
            time: selectedTime,
            isLunar: isLunar,
        };

        try {
            const existing = await AsyncStorage.getItem('birthdayReminders');
            const reminders = existing ? JSON.parse(existing) : [];
            const updated = [...reminders, newReminder];
            await AsyncStorage.setItem('birthdayReminders', JSON.stringify(updated));
            scheduleNotification(newReminder.solarDate, newReminder.time);
        } catch (error) {
            Alert.alert('错误', '保存失败，请重试');
        } finally {
            router.back()
        }
    };
    const handleDatePress = () => {
        // 执行需要的操作，例如：
        if (calendarType === 'lunar') {
            setShowPicker(true);
        } else {
            setDatePickerVisible(true); // 显示日期选择器
        }
    };
    const handleTimePress = () => {
        setModalVisible(true)
    };
    const handleConfirm = (time: { hours: number; minutes: number; seconds: number }) => {
        const formatedTime = `${formatTimeUnit(time.hours)}:${formatTimeUnit(time.minutes)}:${formatTimeUnit(time.seconds)}`
        setSelectedTime(formatedTime);
    };

    const handleCloseModal = () => {
        setDatePickerVisible(false);
    };

    const handleSelectDate = (date: string) => {
        setSelected(date);
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: '新建提醒',
                    headerBackTitle: '返回',
                    headerStyle: {
                        backgroundColor: 'red', // 标题栏背景设为白色
                    },
                    headerTintColor: 'black', // 返回按钮和标题设为黑色
                    headerTitleStyle: {
                        color: 'black', // 单独设置标题颜色
                    },
                    headerTitleAlign: 'center',
                }}
            />
            <TextInput
                style={styles.input}
                placeholder="标题"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="描述"
                value={description}
                onChangeText={setDescription}
            />
            <RadioGroup
                options={[
                    {label: '公历', value: 'solar'},
                    {label: '农历', value: 'lunar'},
                ]}
                selectedValue={calendarType}
                onValueChange={setCalendarType}
                direction="vertical"
                radioStyle={{
                    size: 28,
                    color: '#666',
                    selectedColor: '#1890ff',
                }}
                labelStyle={{
                    fontSize: 18,
                    color: '#444',
                }}
                gap={16}
            />

            <View style={styles.header}>
                <Text style={styles.dateText}> 日期</Text>
                <TouchableOpacity
                    style={styles.dateStyle}
                    onPress={handleDatePress} // 点击事件处理函数
                    activeOpacity={0.7} // 点击时的不透明度效果
                >
                    <Text style={styles.dateText}>{selected}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.dateStyle}
                    onPress={handleTimePress} // 点击事件处理函数
                    activeOpacity={0.7} // 点击时的不透明度效果
                >
                    <Text style={styles.dateText}>{selectedTime}</Text>
                </TouchableOpacity>
            </View>
            <GenderPicker
                initialValue="female"
                onChange={(selected) => setGender(selected)}
                style={{marginTop: 20}}
            />
            <TimePickerModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirm}
            />

            <SolarDatePickerModal
                visible={isDatePickerVisible}
                onClose={handleCloseModal}
                onSelect={handleSelectDate}
            />

            <LunarPicker
                visible={showPicker}
                onConfirm={(date) => {
                    console.log("LunarPicker", date)
                    setSelectedLunar(date)
                    const lunarDate = date.getYearInChinese() + "年" + date.getMonthInChinese() + "月" + date.getDayInChinese()
                    setSelected(lunarDate);
                    setShowPicker(false);
                }}
                onCancel={() => setShowPicker(false)}
            />
            <TouchableOpacity
                style={[styles.saveButton, (!title || !selected) && styles.disabled]}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>确定保存</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    input: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dateText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dateStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20
    },
    disabled: {
        backgroundColor: '#BBDEFB',
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
        padding: 16,
    },
});
