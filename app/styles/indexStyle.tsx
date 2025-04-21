import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6dddd',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        marginTop: 10,
    },
    todayButton: {
        width: 22,
        height: 22,
        marginTop: 10,
        alignItems: 'center',
        borderRadius: 11,
        borderColor: 'red',
        backgroundColor: 'red',
    },
    todayButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    pickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    confirmButton: {
        marginTop: 15,
        alignSelf: 'flex-end',
    },
    confirmText: {
        color: '#5E60CE',
        fontSize: 16,
        fontWeight: '500',
    },
    markText: {
        position: 'absolute',
        top: -8,
        right: -8,
        fontSize: 10,
        minWidth: 18,
        textAlign: 'center',
    },

    infoContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
    },
    bottomLunarText: {
        fontSize: 25,
        color: '#000000',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 3,
    },

    month: {
        marginLeft: 5
    },
    year: {
        marginRight: 5
    },
    dayContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDay: {
        borderWidth: 2,
        borderColor: 'blue',
        borderRadius: 5,
    },
    dayText: {
        fontSize: 18,
        color: '#333',
    },
    disabledText: {
        fontSize: 16,
        color: 'gray',
    },
    todayText: {
        backgroundColor: '#e81297',
        borderWidth: 2,
        borderColor: '#e81297',
        color: "#fff",
        borderRadius: 5,
    },
    weekendText: {
        color: 'red',
    },
    lunarContainer: {
        height: 20, // 固定高度防止换行
        justifyContent: 'center',
    },
    lunarText: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },

    // 节假日文字样式
    holidayText: {
        color: '#ff4d4f',
        fontSize: 11,
        fontWeight: '500'
    },
    // 节气文字样式
    jieqiText: {
        color: '#52c41a',
        fontSize: 11,
        fontWeight: '500'
    },
    // 节气文字样式
    bottomJQText: {
        color: '#000',
        fontSize: 18,
        marginTop:20,
    },
    // 右上角标记容器
    dateNumber: {
        position: 'relative',
        width: 34,
        height: 24,
        alignItems: 'center'
    },

    topMarkContainer: {
        position: 'absolute',
        top: -2.5,
        right: -6,
        backgroundColor: '#ff4d4f',
        borderRadius: 7,
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    },

    workMarkText: {
        color: 'white',
        fontSize: 10,
        lineHeight: 12,
    },
    restMarkText: {
        color: 'white',
        fontSize: 10,
        lineHeight: 12,
    },

    calendar: {
        flex: 0, // 取消flex布局
        height: 440, // 设置固定高度或根据屏幕比例计算
    },
    yiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
    },
    jiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
    },
    labelYi: {
        backgroundColor: '#52c41a', // 绿色背景
        color: 'white',
        borderRadius: 12,
        width: 24,
        height: 24,
        textAlign: 'center',
        lineHeight: 24,
        marginRight: 6,
        fontWeight: 'bold',
    },
    labelJi: {
        backgroundColor: '#ff4d4f', // 红色背景
        color: 'white',
        borderRadius: 12,
        width: 24,
        height: 24,
        textAlign: 'center',
        lineHeight: 24,
        marginRight: 6,
        fontWeight: 'bold',
    },
});
