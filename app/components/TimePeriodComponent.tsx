import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Lunar} from 'lunar-typescript';
import styles from '../styles/shiChenStyle';
import { useRouter } from 'expo-router';
import VerticalText from "@/app/components/VerticalText";
import {replaceCommasWithSpaces} from "@/app/Utils/DhdUtils";

interface verticalTextProp {
    text: string
}

const TimePeriodComponent = () => {
    const router = useRouter();
    const lunar = Lunar.fromDate(new Date());
    const periods = lunar.getTimes(); // 获取时辰信息
    const shiChen = lunar.getTimeInGanZhi()
    const timePeriod = lunar.getTimes()
    let shiJianDuan = ''
    let chongMsg = ''
    let shaMsg = ''
    let caiMsg = ''
    let xiMsg = ''
    let fuMsg = ''
    let guiMsg = ''
    let yiMsg = ''
    let jiMsg = ''
    for (let i = 0; i < timePeriod.length; i++) {
        if (timePeriod[i].getGanZhi() === shiChen) {
            const period = timePeriod[i];
            shiJianDuan = period.getMinHm() + '-' + period.getMaxHm();
            chongMsg = period.getChongShengXiao()
            shaMsg = period.getSha()
            caiMsg = period.getPositionCaiDesc()
            xiMsg = period.getPositionXiDesc()
            fuMsg = period.getPositionFuDesc()
            guiMsg = period.getPositionYangGuiDesc()
            yiMsg = replaceCommasWithSpaces(period.getYi().toString());
            jiMsg = replaceCommasWithSpaces(period.getJi().toString());
        }
    }
    const handlePress = () => {
        router.push({
            // @ts-ignore
            pathname: 'pages/ShiChenDetail',
            params: {
                id: 123,
            }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.timeInfoContainer} onPress={handlePress}>
                <Text style={styles.shiChenTitle}>当前时辰</Text>
                <View style={styles.scBox}>
                    <VerticalText text={`${shiChen}时`}/>
                    <View style={styles.scDetail}>
                        <Text style={styles.timeInfoText}>{shiJianDuan} 冲{chongMsg} 煞{shaMsg}</Text>
                        <View style={styles.cxfg}>
                            <Text style={styles.cai}>财 丨 {caiMsg}</Text>
                            <Text style={styles.xi}>喜 丨 {xiMsg}</Text>
                            <Text style={styles.fu}>福 丨 {fuMsg}</Text>
                            <Text style={styles.gui}>贵 丨 {guiMsg}</Text>
                        </View>

                        <Text style={styles.yi}>宜: {yiMsg}</Text>
                        <Text style={styles.ji}>忌: {jiMsg}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};


export default TimePeriodComponent;
