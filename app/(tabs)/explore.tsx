import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    FlatList, Dimensions, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {Ionicons} from "@expo/vector-icons";
import {DaYun, EightChar, Solar, Yun} from "lunar-typescript";
import {replaceCommasWithSpaces} from "@/app/Utils/DhdUtils";

const screenWidth = Dimensions.get('window').width;
export default function MinPanScreen() {
    const [reminders, setReminders] = useState<BirthdayReminder[]>([]);
    const [selectedReminder, setSelectedReminder] = useState<BirthdayReminder>();
    const [showPicker, setShowPicker] = useState(false);
    const isFocused = useIsFocused();
    const [baZi, setBaZi] = useState<EightChar>();
    const [qiYun, setQiYun] = useState<string>('');
    const [dayun, setDaun] = useState<DaYun[]>();

    // 初始化加载八字数据
    useEffect(() => {
        const loadReminders = async () => {
            const stored = await AsyncStorage.getItem('birthdayReminders');
            if (stored) {
                const parsed: BirthdayReminder[] = JSON.parse(stored);
                setReminders(parsed);
                if (parsed.length > 0 && !selectedReminder) {
                    setSelectedReminder(parsed[0]);
                }
            }
        };
        loadReminders();
    }, [isFocused]);

    // 更新八字数据
    useEffect(() => {
        if (selectedReminder) {
            const dateString = selectedReminder.solarDate;
            console.log(selectedReminder)
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() returns 0-11, so we add 1
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            let solar = Solar.fromYmd(year, month, day);
            let lunar = solar.getLunar();
            let d = lunar.getEightChar();
            setBaZi(d);
            // 获取男运
            let yun = d.getYun(selectedReminder?.gender === 'male' ? 1 : 0);
            // 起运
            const qy = yun.getStartYear() + '年' + yun.getStartMonth() + '个月' + yun.getStartDay() + '天后起运';
            setQiYun(qy);
            // 获取大运表
            setDaun(yun.getDaYun());
        }
    }, [selectedReminder]);


    // 渲染流年项
    const renderLiuNianItem = (liuNian: any) => (
        <View style={styles.liuNianContainer}>
            <Text style={styles.text}>{liuNian.getGanZhi()}</Text>
            <Text style={styles.text}>{liuNian.getYear()}</Text>
            {/*<Text style={styles.text}>{liuNian.getAge()}</Text>*/}
        </View>
    );

    // 渲染大运项
    const renderDaYunItem = (daYun: any) => (
        <View style={styles.daYunContainer}>
            <Text style={styles.dytext}>{daYun.getStartYear()}</Text>
            <Text style={styles.dytext}> {daYun.getStartAge()} </Text>
            <Text style={styles.dytext}> {daYun.getGanZhi()}</Text>
            {daYun.getLiuNian().map((liuNian: any, index: any) => (
                <View key={index} style={styles.liuNianContainer}>
                    {renderLiuNianItem(liuNian)}
                </View>
            ))}
        </View>
    );


    // 格式化日期显示
    const formatDateDisplay = (reminder: BirthdayReminder) => {
        return reminder.isLunar
            ? `农历 ${reminder.lunarDate}`
            : `公历 ${reminder.solarDate}`;
    };

// 定义一个函数来根据五行元素返回颜色
    const getColorByElement = (element: any) => {
        switch (element) {
            case '木':
                return 'green';
            case '火':
                return 'red';
            case '土':
                return 'brown';
            case '金':
                return 'gold';
            case '水':
                return 'blue';
            default:
                return 'black';
        }
    };

    const renderColoredText = (text: any, element: any) => {
        if (!element && !text) {
            return
        }
        const elements = element.split('');
        return (
            <Text style={styles.text}>
                {text.split('').map((char: any, index: any) => (
                    <Text key={index} style={{fontWeight: 'bold', color: getColorByElement(elements[index])}}>
                        {char}
                    </Text>
                ))}
            </Text>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>八字排盘</Text>
            </View>

            {/* 顶部选择栏 */}
            <TouchableOpacity
                style={styles.header}
                onPress={() => setShowPicker(true)}
            >
                <Text style={styles.titleText}>
                    {selectedReminder?.title} {selectedReminder?.gender == 'male' ? "男" : "女"}
                </Text>
                <Ionicons name="caret-down-outline" size={24} color="#666"/>
            </TouchableOpacity>

            {/* 日期显示 */}
            {selectedReminder && (
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                        {formatDateDisplay(selectedReminder)}
                    </Text>
                </View>
            )}
            <View style={styles.bazi}>
                <Text>生日 {selectedReminder?.lunarDate}</Text>

                <View style={styles.bzContainer}>
                    <Text style={styles.text}>{selectedReminder?.gender == 'male' ? "乾造" : "坤造"}</Text>
                    <Text style={styles.text}>年柱</Text>
                    <Text style={styles.text}>月柱</Text>
                    <Text style={styles.text}>日柱</Text>
                    <Text style={styles.text}>时柱</Text>
                </View>
                {/*<View style={styles.bzContainer}>*/}
                {/*    <Text style={styles.text}>八字</Text>*/}
                {/*    <Text style={styles.text}>{baZi?.getYear()}</Text>*/}
                {/*    <Text style={styles.text}>{baZi?.getMonth()}</Text>*/}
                {/*    <Text style={styles.text}>{baZi?.getDay()}</Text>*/}
                {/*    <Text style={styles.text}>{baZi?.getTime()}</Text>*/}
                {/*</View>*/}

                <View style={styles.bzContainer}>
                    <Text style={styles.text}>八字</Text>
                    {renderColoredText(baZi?.getYear(), baZi?.getYearWuXing())}
                    {renderColoredText(baZi?.getMonth(), baZi?.getMonthWuXing())}
                    {renderColoredText(baZi?.getDay(), baZi?.getDayWuXing())}
                    {renderColoredText(baZi?.getTime(), baZi?.getTimeWuXing())}
                </View>


                <View style={styles.bzContainer}>
                    <Text style={styles.text}>十神</Text>
                    <Text style={styles.text}>{replaceCommasWithSpaces(baZi?.getYearShiShenGan())}</Text>
                    <Text style={styles.text}>{replaceCommasWithSpaces(baZi?.getMonthShiShenGan())}</Text>
                    <Text style={styles.text}>{replaceCommasWithSpaces(baZi?.getDayShiShenGan())}</Text>
                    <Text style={styles.text}>{replaceCommasWithSpaces(baZi?.getTimeShiShenGan())}</Text>
                </View>

                <View style={styles.bzContainer}>
                    <Text style={styles.text}>藏干</Text>
                    <Text style={styles.text}>{baZi?.getYearHideGan()}</Text>
                    <Text style={styles.text}>{baZi?.getMonthHideGan()}</Text>
                    <Text style={styles.text}>{baZi?.getDayHideGan()}</Text>
                    <Text style={styles.text}>{baZi?.getTimeHideGan()}</Text>
                </View>
                <View style={styles.bzContainer}>
                    <Text style={styles.text}>纳音</Text>
                    <Text style={styles.text}>{baZi?.getYearNaYin()}</Text>
                    <Text style={styles.text}>{baZi?.getMonthNaYin()}</Text>
                    <Text style={styles.text}>{baZi?.getDayNaYin()}</Text>
                    <Text style={styles.text}>{baZi?.getTimeNaYin()}</Text>
                </View>
                <View style={styles.bzContainer}>
                    <Text style={styles.text}>五行</Text>
                    <Text style={styles.text}>{baZi?.getYearWuXing()}</Text>
                    <Text style={styles.text}>{baZi?.getMonthWuXing()}</Text>
                    <Text style={styles.text}>{baZi?.getDayWuXing()}</Text>
                    <Text style={styles.text}>{baZi?.getTimeWuXing()}</Text>
                </View>
                <View style={styles.bzContainer}>
                    <Text style={styles.text}>地势</Text>
                    <Text style={styles.text}>{baZi?.getYearDiShi()}</Text>
                    <Text style={styles.text}>{baZi?.getMonthDiShi()}</Text>
                    <Text style={styles.text}>{baZi?.getDayDiShi()}</Text>
                    <Text style={styles.text}>{baZi?.getTimeDiShi()}</Text>
                </View>
                <Text style={styles.qYtext}>起运 {qiYun}</Text>
                <Text style={styles.qYtext}>流年</Text>
            </View>

            <ScrollView horizontal={true} contentContainerStyle={styles.lncontainer}>
                {dayun?.map((daYun, index) => (
                    <View key={index} style={styles.daYunContainer}>
                        {renderDaYunItem(daYun)}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bazi}>
                <Text style={styles.qYtext}>解读</Text>
            </View>
            {/* 选择器模态框 */}
            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.pickerContent}>
                        <FlatList
                            data={reminders}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => {
                                        setSelectedReminder(item);
                                        setShowPicker(false);
                                    }}
                                >
                                    <Text style={styles.listText}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    titleContainer: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: 1,
        backgroundColor: 'red'
    },
    header: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    bazi: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    titleText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    dateContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateText: {
        fontSize: 16,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    pickerContent: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 8,
        maxHeight: '60%',
    },
    listItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listText: {
        fontSize: 16,
        color: '#333',
    },
    bzContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: screenWidth,
    },
    text: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dytext: {
        flex: 1,
        textAlign: 'center',
        marginBottom: 10,
        color: '#464650'
    },
    qYtext: {
        flex: 1,
        marginTop: 20,
        fontWeight: 'bold'
    },
    lncontainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 20,
    },
    dycontainer: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    daYunContainer: {
        marginRight: 20,
    },
    liuNianContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
});
