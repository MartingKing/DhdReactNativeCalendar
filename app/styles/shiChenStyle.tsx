import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    periodListContainer: {
        flex: 1,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10,
    },
    timePeriodContainer: {
        marginBottom: 10,
    },
    timePeriodText: {
        color: 'white',
        fontSize: 16,
    },
    statusContainer: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        marginTop: 5,
    },
    statusText: {
        fontSize: 14,
    },
    timeInfoContainer: {
        flex: 2,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10,
    },
    timeInfoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    shiChenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    bottomLunarText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    yiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    jiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    labelYi: {
        fontSize: 16,
        color: 'green',
        marginRight: 5,
    },
    labelJi: {
        fontSize: 16,
        color: 'red',
        marginRight: 5,
    },
    bottomJQText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cxfg: {
        display: "flex",
        flexDirection: 'row',
    },
    cai: {
        display: "flex",
        color: 'red'
    },
    xi: {
        display: "flex",
        marginLeft: 20,
        color: '#e471bb'
    },
    fu: {
        display: "flex",
        marginLeft: 20,
        color: '#f4da25'
    },
    gui: {
        display: "flex",
        marginLeft: 20,
        color: '#2c77cc'
    },
    yi: {
        display: "flex",
        color: '#46cf0f'
    },
    ji: {
        display: "flex",
        color: '#f60202'
    },
    scBox: {
        display: "flex",
        flexDirection: "row",
        alignItems:'center',
        marginTop:15,
    },
    scDetail: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 20,
    },
    verticalTextContainer: {
        backgroundColor: 'red',
        borderRadius: 10,
        width: 25,
        height: 84,
        padding: 10,
        flexDirection: 'column', // 竖排显示文字
        alignItems: 'center', // 居中文字
    },
    verticalText: {
        color: 'white',
        fontSize: 16,
    },
    shiChenDetailContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
});
