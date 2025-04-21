import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useRouter} from "expo-router";

export default function MyScreen() {
    const router = useRouter();
    const handlePress = () => {
        router.push({
            // @ts-ignore
            pathname: 'pages/BirthDayReminder',
        });
    };
    const handleScPress = () => {
        router.push({
            // @ts-ignore
            pathname: 'pages/ShiChenDetail',
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={require('../../assets/images/icon.png')} // 使用本地图片
                    style={styles.avatar}
                />
                <Text style={styles.username}>用户名</Text>
            </View>
            <TouchableOpacity style={styles.reminderContainer} onPress={handlePress}>
                <Text style={styles.reminderText}>生日提醒</Text>
                <Image
                    source={require('../../assets/images/icon_right.svg')}
                    style={styles.arrow}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reminderContainer} onPress={handleScPress}>
                <Text style={styles.reminderText}>时辰宜忌</Text>
                <Image
                    source={require('../../assets/images/icon_right.svg')}
                    style={styles.arrow}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6dddd',
    },
    profileContainer: {
        height: 250,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
    },
    reminderContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        width: '96%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 15,
        borderWidth: 1,
        paddingTop: 12,
        paddingBottom: 12,
        borderColor: 'white'
    },
    reminderText: {
        color: 'black',
    },
    arrow: {
        width: 15,
        height: 20,
        marginRight: 10,
    },
});
