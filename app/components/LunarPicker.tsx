import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Modal from 'react-native-modal';
import {Lunar, LunarMonth, LunarYear} from 'lunar-typescript';
import {Picker} from '@react-native-picker/picker';
import {getMonthName} from "@/app/Utils/DhdUtils";

interface PickerProps {
    visible: boolean;
    onConfirm: (date: Lunar) => void;
    onCancel: () => void;
}

interface MonthOption {
    value: number;
    label: string; // 确保label属性存在
    isLeap: boolean;
}

const LunarPicker = ({visible, onConfirm, onCancel}: PickerProps) => {
    // 获取当前农历日期
    const initialLunarDate = Lunar.fromDate(new Date());
    const initialYear = initialLunarDate.getYear();
    const initialMonth = initialLunarDate.getMonth();
    const initialDay = initialLunarDate.getDay();

    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [day, setDay] = useState(initialDay);
    const [months, setMonths] = useState<MonthOption[]>();
    const [days, setDays] = useState<number[]>();
    const [monthDaysMap, setMonthDaysMap] = useState(new Map());
    // 初始化数据
    useEffect(() => {
        const lunarYear = LunarYear.fromYear(initialYear);
        const monthsInYear = lunarYear.getMonthsInYear();
        const initialMonths: MonthOption[] = [];
        const initialMonthDaysMap = new Map<number, number>();

        monthsInYear.forEach(m => {
            const isLeap = m.isLeap();
            initialMonths.push({
                value: m.getMonth(),
                label: getMonthName(m.getMonth()),
                isLeap
            });
            initialMonthDaysMap.set(m.getMonth(), m.getDayCount());
        });

        setMonths(initialMonths);
        setMonthDaysMap(initialMonthDaysMap);
        setDays(Array.from({length: initialMonthDaysMap.get(initialMonth)!}, (_, i) => i + 1));
    }, []);

    // 生成年份选项（1900-2100）
    const years = useMemo(() => Array.from({length: 201}, (_, i) => 1900 + i), []);

    const handleConfirm = () => {
        try {
            const lunarDate = Lunar.fromYmd(year, month, day);
            onConfirm(lunarDate);
            onCancel();
        } catch (e) {
            console.log('无效的农历日期')
        }
    };
    const handleYearChange = (selectedYear: number) => {
        const lunarYear = LunarYear.fromYear(selectedYear);
        const monthsInYear = lunarYear.getMonthsInYear();
        const newMonths: MonthOption[] = [];
        const newMonthDaysMap = new Map<number, number>();

        monthsInYear.forEach(m => {
            const isLeap = m.isLeap();
            newMonths.push({
                value: m.getMonth(),
                label: isLeap ? `${getMonthName(m.getMonth())}` : getMonthName(m.getMonth()),
                isLeap
            });
            newMonthDaysMap.set(m.getMonth(), m.getDayCount());
        });

        setMonths(newMonths);
        setMonthDaysMap(newMonthDaysMap);
        setYear(selectedYear);

        // 保持当前月选中或重置为第一个月
        const isValidMonth = newMonths.some(m => m.value === month);
        if (!isValidMonth && newMonths.length > 0) {
            setMonth(newMonths[0].value);
            setDays(Array.from({length: newMonths[0].value}, (_, i) => i + 1));
        }
    }
    // 3. 处理月份选择
    const handleMonthChange = (selectedMonth: number) => {
        setMonth(selectedMonth);
        const daysCount = monthDaysMap.get(selectedMonth) || 30;
        setDays(Array.from({length: daysCount}, (_, i) => i + 1));
    };

    return (
        <Modal
            isVisible={visible}
            style={styles.modal}
            backdropOpacity={0.4}
        >
            <View style={styles.container}>
                <Text style={styles.title}>农历日期</Text>

                {/* 选择器容器 */}
                <View style={styles.pickerContainer}>
                    {/* 年份选择 */}
                    <Picker
                        selectedValue={year}
                        style={styles.picker}
                        onValueChange={handleYearChange}
                        mode="dropdown" // 设置下拉样式
                        dropdownIconColor="#666" // 设置下拉图标颜色
                    >
                        {years.map(y => (
                            <Picker.Item
                                key={`year-${y}`} // 使用唯一键值
                                label={`${y}年`}
                                value={y}
                                color="#333" // 设置文字颜色
                                fontFamily="System" // 设置字体（可选）
                            />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={month}
                        style={styles.picker}
                        onValueChange={handleMonthChange}>
                        {months?.map(m => (
                            <Picker.Item
                                key={`${m.value}-${m.isLeap ? 'leap' : 'normal'}`}
                                label={m.label}
                                value={m.value}
                            />
                        ))}
                    </Picker>

                    {/* 日期选择 */}
                    <Picker
                        selectedValue={day}
                        style={styles.picker}
                        onValueChange={(itemValue: number) => setDay(itemValue)}
                        itemStyle={styles.dayItem} // 单独定义日期项样式
                    >
                        {days?.map(d => (
                            <Picker.Item
                                key={`day-${d}`}
                                label={`${d.toString().padStart(2, '0')}日`} // 保持两位数显示
                                value={d}
                                color={d === day ? '#1890ff' : '#666'} // 选中高亮
                            />
                        ))}
                    </Picker>

                </View>

                {/* 操作按钮 */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={[styles.button, styles.cancelButton]}
                    >
                        <Text>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[styles.button, styles.confirmButton]}
                    >
                        <Text style={styles.confirmText}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// 跨平台样式适配
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        margin: Platform.select({
            web: 20,
            default: 0
        })
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
            web: {
                maxWidth: 500,
                marginHorizontal: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            default: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
            }
        })
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Platform.select({
            android: {
                height: 160
            }
        })
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16
    },
    button: {
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 12
    },
    confirmButton: {
        backgroundColor: '#1890ff'
    },
    confirmText: {
        color: 'white'
    },
    picker: {
        flex: 1,
        ...Platform.select({
            ios: {
                height: 160,
                backgroundColor: '#f8f8f8'
            },
            android: {
                height: 48,
                marginVertical: 8
            },
            web: {
                minWidth: 120,
                padding: 8,
                borderWidth: 1,
                borderColor: '#ddd'
            }
        })
    },
    dayItem: {
        fontSize: Platform.select({
            ios: 16,
            android: 14,
            web: 16
        })
    }
});


export default LunarPicker;
