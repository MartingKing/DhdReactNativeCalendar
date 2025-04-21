// ShiChenDetail.tsx
import React from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import {Lunar, LunarTime} from 'lunar-typescript';
import {Stack, useLocalSearchParams} from 'expo-router';
import styles from '../styles/shiChenStyle';
import VerticalText from "@/app/components/VerticalText";

const ShiChenDetail = () => {
    const params = useLocalSearchParams();
    console.log("received from prev--", params.id);

    // 将Lunar实例移动到组件内部以确保数据最新
    const lunar = Lunar.fromDate(new Date());
    const periods = lunar.getTimes();

    // 修正后的renderItem参数解析
    const renderItem = ({ item }: { item: LunarTime }) => {
        return (
            <ScrollView style={styles.scBox}>
                <VerticalText text={`${item.getGanZhi()}时`}/>
                <View style={styles.scDetail}>
                    <Text style={styles.timeInfoText}>{`${item.getMinHm()}-${item.getMaxHm()} 冲${item.getChongShengXiao()} 煞${item.getSha()}`}</Text>
                    <View style={styles.cxfg}>
                        <Text style={styles.cai}>财 丨 {item.getPositionCaiDesc()}</Text>
                        <Text style={styles.xi}>喜 丨 {item.getPositionXiDesc()}</Text>
                        <Text style={styles.fu}>福 丨 {item.getPositionFuDesc()}</Text>
                        <Text style={styles.gui}>贵 丨 {item.getPositionYangGuiDesc()}</Text>
                    </View>

                    <Text style={styles.yi}>宜: {item.getYi().toString().replace(/,/g, ' ')}</Text>
                    <Text style={styles.ji}>忌: {item.getJi().toString().replace(/,/g, ' ')}</Text>
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.shiChenDetailContainer}>
            <Stack.Screen
                options={{
                    title: '时辰宜忌',
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
            <FlatList
                data={periods}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>暂无数据</Text>}
            />
        </View>
    );
};

export default ShiChenDetail;
