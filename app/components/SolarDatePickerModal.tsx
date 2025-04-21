import React, {useEffect, useState} from 'react';
import {Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

type SolarDatePickerModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelect: (date: string) => void;
};

const SolarDatePickerModal: React.FC<SolarDatePickerModalProps> = ({ visible, onClose, onSelect }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    const years = Array.from({ length: 201 }, (_, i) => 1900 + i); // 增加年份到2100年
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

    useEffect(() => {
        setSelectedDay(Math.min(selectedDay, getDaysInMonth(selectedYear, selectedMonth)));
    }, [selectedYear, selectedMonth]);

    const handleSelect = () => {
        onSelect(`${selectedYear}-${selectedMonth}-${selectedDay}`);
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>公历日期</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedYear}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            mode="dropdown"
                            dropdownIconColor="#666"
                        >
                            {years.map((year) => (
                                <Picker.Item key={year} label={`${year}年`} value={year} color="#333" fontFamily="System" />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={selectedMonth}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                        >
                            {months.map((month) => (
                                <Picker.Item key={month} label={`${month}月`} value={month} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={selectedDay}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedDay(itemValue)}
                            itemStyle={styles.dayItem}
                        >
                            {days.map((day) => (
                                <Picker.Item key={day} label={`${day}日`} value={day} color={day === selectedDay ? '#1890ff' : '#666'} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelect} style={[styles.button, styles.confirmButton]}>
                            <Text style={styles.confirmText}>确定</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: 400, // 增加选择框的宽度
        ...Platform.select({
            web: {
                maxWidth: 500,
                marginHorizontal: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            default: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            },
        }),
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Platform.select({
            android: {
                height: 160,
            },
        }),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    button: {
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 12,
    },
    confirmButton: {
        backgroundColor: '#1890ff',
    },
    confirmText: {
        color: 'white',
    },
    picker: {
        flex: 1,
        ...Platform.select({
            ios: {
                height: 160,
                backgroundColor: '#f8f8f8',
            },
            android: {
                height: 48,
                marginVertical: 8,
            },
            web: {
                minWidth: 120,
                padding: 8,
                borderWidth: 1,
                borderColor: '#ddd',
            },
        }),
    },
    dayItem: {
        fontSize: Platform.select({
            ios: 16,
            android: 14,
            web: 16,
        }),
    },
});

export default SolarDatePickerModal;
