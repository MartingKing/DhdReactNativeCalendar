import {Animated, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import {CalendarList, DateData} from "react-native-calendars";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {HolidayUtil, Lunar, Solar, SolarWeek} from "lunar-typescript";
import styles from '../styles/indexStyle';
import CalendarModal from "@/app/components/CalendarModal";
import ScrollView = Animated.ScrollView;
import TimePeriodComponent from "@/app/components/TimePeriodComponent";
import {formatDate} from "@/app/Utils/DhdUtils";

const RANGE = 12 * 12;//显示12年的日历范围
export default function HomeScreen() {
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [yearWeek, setWeekNumber] = useState(0);

    // 处理月份变化
    const handleMonthChange = (date: any) => {
        const currentMonth = new Date(date.dateString);
        const today = new Date();
        // 判断是否当前月份
        const isCurrentMonth =
            currentMonth.getFullYear() === today.getFullYear() &&
            currentMonth.getMonth() === today.getMonth();
    };
    const getWeekNumber = (dateString: string) => {
        const date = new Date(dateString);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)); // 使用 getTime() 方法
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    };

    // 动态获取日期
    const today = new Date();

    // 动态生成初始日期
    const initialDate = formatDate(today);
    const nextWeekDate = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
    const nextMonthDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()));
    const [selected, setSelected] = useState(initialDate);

    useEffect(() => {
        const weekNum = getWeekNumber(selected);
        setWeekNumber(weekNum);
    }, [selected]);

    const solar = Solar.fromDate(new Date(selected));
    const lunar = Lunar.fromDate(new Date(selected));
    const holiday = HolidayUtil.getHoliday(solar.getYear(), solar.getMonth(), solar.getDay());
    //------计算当前日期和上下两个节气的时间差单位为天------
    const prevJieQi = lunar.getPrevJieQi();
    const nextJieQi = lunar.getNextJieQi();
    const [prevDatePart] = prevJieQi.getSolar().toYmdHms().split(' ');
    const [nextDatePart] = nextJieQi.getSolar().toYmdHms().split(' ');
    const [yearPrev, monthPrev, dayPrev] = prevDatePart.split('-').map(Number);
    const [yearNext, monthNext, dayNext] = nextDatePart.split('-').map(Number);
    const prevTargetDate = new Date(yearPrev, monthPrev - 1, dayPrev);
    const nextTargetDate = new Date(yearNext, monthNext - 1, dayNext);
    prevTargetDate.setHours(0, 0, 0, 0);
    nextTargetDate.setHours(0, 0, 0, 0);

    // 计算天数差
    const prevDiffTime = prevTargetDate.getTime() - new Date(selected).getTime();
    const nextDiffTime = nextTargetDate.getTime() - new Date(selected).getTime();
    const prevDiffDays = Math.ceil(prevDiffTime / (1000 * 60 * 60 * 24));
    const nextDiffDays = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24));
    let prevMsg = ""
    let nextMsg = ""
    if (prevDiffDays === 0) {
        prevMsg = "（今天）";
    } else if (prevDiffDays > 0) {
        prevMsg = `（还有${prevDiffDays}天）`;
    } else {
        prevMsg = `（已过${Math.abs(prevDiffDays)}天）`;
    }
    if (nextDiffDays === 0) {
        nextMsg = "（今天）";
    } else if (nextDiffDays > 0) {
        nextMsg = `（还有${nextDiffDays}天）`;
    } else {
        nextMsg = `（已过${Math.abs(nextDiffDays)}天）`;
    }
    //------计算当前日期和上下两个节气的时间差单位为天------


    const marked = useMemo(() => ({
        [nextWeekDate]: {
            marked: true,
            dotColor: '#5E60CE',
        },
        [nextMonthDate]: {
            marked: true,
            dotColor: '#5E60CE',
        },
        [selected]: {
            selected: true,
            selectedColor: 'transparent', // 透明背景
            customStyles: {
                container: {
                    borderWidth: 2,
                    borderColor: 'blue', // 蓝色边框
                    borderRadius: 5,
                }
            }
        }
    }), [selected, nextWeekDate, nextMonthDate]);

    // 自定义日期组件
    const renderDay = useCallback(({date, state}: any) => {
        const currentDate = new Date(date.dateString);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const solarDate = Solar.fromDate(currentDate);
        const lunarDateObj = Lunar.fromDate(currentDate);
        const holiday = HolidayUtil.getHoliday(solarDate.getYear(), solarDate.getMonth(), solarDate.getDay());
        const jieQi = lunarDateObj.getJieQi();
        const isOtherFest = lunarDateObj.getOtherFestivals().length > 0
        // 标记逻辑
        let topMark = null;
        let bottomText = lunarDateObj.getDayInChinese();

        if (holiday) {
            // 判断是否休息日
            const isRestDay = holiday.getTarget() === holiday.getDay();

            // 右上角标记（优先判断补班）
            if (holiday.isWork()) {
                topMark = (
                    <View style={styles.topMarkContainer}>
                        <Text style={styles.workMarkText}>班</Text>
                    </View>
                );
            }
            // 显示"休"标记（非节日本身的休息日）
            else if (!isRestDay || !holiday.isWork()) {
                topMark = (
                    <View style={styles.topMarkContainer}>
                        <Text style={styles.restMarkText}>休</Text>
                    </View>
                );
            }
            // 底部文字处理
            bottomText = holiday.getTarget() === holiday.getDay() ? holiday.getName() : lunarDateObj.getDayInChinese() // 节日当天显节假日
        } else if (jieQi) {
            bottomText = jieQi;
        }
        if (bottomText.includes("初一")) {
            bottomText = lunarDateObj.getMonthInChinese().toString() + "月"
        }
        if (isOtherFest) {
            bottomText = lunarDateObj.getOtherFestivals().toString()
        }
        const isSelected = selected === date.dateString;
        return (
            <TouchableOpacity
                style={[
                    styles.dayContainer,
                    isSelected && styles.selectedDay,
                    state === 'today' && styles.todayText,
                ]}
                onPress={() => setSelected(date.dateString)}
            >
                {/* 日期数字和标记 */}
                <View style={styles.dateNumber}>
                    <Text style={[
                        styles.dayText,
                        isWeekend && state !== 'disabled' && styles.weekendText,
                        state === 'disabled' && styles.disabledText
                    ]}>
                        {date.day}
                    </Text>
                    {topMark}
                </View>

                {/* 底部文字区域 */}
                <View style={styles.lunarContainer}>
                    <Text style={[
                        styles.lunarText,
                        holiday && styles.holidayText,
                        jieQi && styles.jieqiText,
                        isOtherFest && styles.jieqiText
                    ]}>
                        {bottomText}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, [selected]);

    const renderLunarDate = (dateString: any) => {
        const date = new Date(dateString);
        const lunar = Lunar.fromDate(date);
        return `${lunar.getDayInChinese()}`;
    };

    const onDayPress = useCallback((day: DateData) => {
        setSelected(day.dateString);
        const lunarDate = renderLunarDate(day.dateString);
    }, []);
    const handleHeaderPress = () => {
        // 执行需要的操作，例如：
        setDatePickerVisible(true); // 显示日期选择器
        console.log('Header clicked!');
    };

    function renderCustomHeader(date: any) {
        const header = date.toString('MMMM yyyy');
        const [month, year] = header.split(' ');
        const textStyle: TextStyle = {
            fontSize: 18,
            fontWeight: 'bold',
            paddingTop: 10,
            paddingBottom: 10,
            color: '#5E60CE',
            paddingRight: 5
        };

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={handleHeaderPress} // 点击事件处理函数
                    activeOpacity={0.7} // 点击时的不透明度效果
                >
                    <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
                    <Text style={[styles.year, textStyle]}>{year}</Text>
                </TouchableOpacity>
                {/* 今按钮 */}
                {/*{showTodayButton && (*/}
                {/*    <TouchableOpacity*/}
                {/*        style={styles.todayButton}*/}
                {/*        onPress={handleTodayPress}>*/}
                {/*        <Text style={styles.todayButtonText}>今</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*)}*/}
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View>
                <CalendarModal
                    visible={isDatePickerVisible}
                    selectedDate={selectedDate}
                    onConfirm={(date) => {
                        console.log("select data=", formatDate(date))
                        setSelected(formatDate(date));
                        setDatePickerVisible(false);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                />
                <CalendarList
                    onDayPress={onDayPress}
                    current={selected}
                    pastScrollRange={RANGE}
                    futureScrollRange={RANGE}
                    markedDates={marked}
                    renderHeader={renderCustomHeader}
                    horizontal={true}
                    pagingEnabled={true}
                    dayComponent={renderDay}
                    onMonthChange={handleMonthChange}
                    style={styles.calendar}
                />
            </View>

            {/* 详细信息面板 */}
            <View style={styles.infoContainer}>
                <Text style={styles.bottomLunarText}>{lunar.getMonthInChinese()}月{lunar.getDayInChinese()}</Text>
                <Text style={styles.infoText}>
                    {lunar.getYearInGanZhi()}[{lunar.getYearShengXiao()}]年 {lunar.getMonthInGanZhi()}[{lunar.getMonthShengXiaoExact()}]月 {lunar.getDayInGanZhi()}[{lunar.getDayShengXiao()}]日
                </Text>
                <Text
                    style={styles.infoText}>{solar.getYear()}年第{yearWeek}周 {solar.getMonth()}月第{Math.ceil(solar.getDay() / 7)}周 {solar.getXingzuo()}座</Text>

                <Text style={styles.infoText}>节假日: {holiday?.getName() || '无'}</Text>
                <View style={styles.yiRow}>
                    <Text style={styles.labelYi}>宜</Text>
                    <Text style={styles.infoText}> {lunar.getDayYi().join(' ')}</Text>
                </View>
                <View style={styles.jiRow}>
                    <Text style={styles.labelJi}>忌</Text>
                    <Text style={styles.infoText}> {lunar.getDayJi().join(' ')}</Text>
                </View>
                <TimePeriodComponent/>
                <Text style={styles.bottomJQText}>节气</Text>
                <Text style={styles.infoText}>{prevJieQi.getName()}:{prevJieQi.getSolar().toYmdHms()} {prevMsg}</Text>
                <Text style={styles.infoText}>{nextJieQi.getName()}:{nextJieQi.getSolar().toYmdHms()} {nextMsg}</Text>
            </View>

        </ScrollView>
    );
}
