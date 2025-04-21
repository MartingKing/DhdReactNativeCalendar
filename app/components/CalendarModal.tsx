// CalendarModal.tsx
import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {Lunar, HolidayUtil, Solar} from 'lunar-typescript';

interface Props {
    visible: boolean;
    selectedDate: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
}

const CalendarModal: React.FC<Props> = ({visible, selectedDate, onConfirm, onCancel}) => {
    const [tempDate, setTempDate] = useState(selectedDate);

    // 处理日期选择
    const handleDateChange = (date: Date) => {
        setTempDate(date);
    };

    // 确认选择
    const handleConfirm = () => {
        onConfirm(tempDate);
    };

    // 自定义日期样式
    const customDatesStyles = (date: Date) => {
        const solar = Solar.fromDate(date);
        const lunar = Lunar.fromDate(date);
        const holiday = HolidayUtil.getHoliday(solar.getYear(), solar.getMonth(), solar.getDay());

        const styles: any = {};

        // 今天样式
        if (date.toDateString() === new Date().toDateString()) {
            styles.style = {
                backgroundColor: '#5E60CE',
                borderRadius: 20
            };
            styles.textStyle = {
                color: '#fff'
            };
        }

        // 节假日样式
        if (holiday) {
            styles.style = {
                backgroundColor: holiday.isWork() ? '#ff69b4' : '#ff4d4f',
                borderRadius: 20
            };
            styles.textStyle = {
                color: '#fff'
            };
        }

        // 节气样式
        if (lunar.getJieQi()) {
            styles.style = {
                borderColor: '#52c41a',
                borderWidth: 1,
                borderRadius: 20
            };
        }

        return styles;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.calendarContainer}>
                    {/* 日历主体 */}
                    <CalendarPicker
                        startFromMonday={true}
                        onDateChange={handleDateChange}
                        customDatesStyles={customDatesStyles}
                        months={["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月",]}
                        monthTitleStyle={styles.monthTitle}
                        yearTitleStyle={styles.yearTitle}
                        weekdays={["一", "二", "三", "四", "五", "六", "日",]}
                        todayBackgroundColor="transparent"
                        selectedDayColor="#5E60CE"
                        selectedDayTextColor="#fff"
                        nextTitle=""
                        previousTitle=""
                    />

                    {/* 操作按钮 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.okButtonText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        paddingBottom: 20
    },
    monthTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold'
    },
    yearTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15
    },
    cancelButton: {
        padding: 10,
        marginRight: 15
    },
    confirmButton: {
        backgroundColor: '#5E60CE',
        borderRadius: 8,
        padding: 10,
        minWidth: 80,
        alignItems: 'center',
        marginRight: 20,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16
    },
    cancelButtonText: {
        color: '#5E60CE',
        fontSize: 16
    },
    confirmButtonText: {
        color: 'white'
    }
});

export default CalendarModal;
