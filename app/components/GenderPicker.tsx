import React, {useState, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

interface GenderPickerProps {
    /** 初始选中值 */
    initialValue?: 'male' | 'female';
    /** 选择变更回调 */
    onChange?: (gender: 'male' | 'female') => void;
    /** 自定义样式 */
    style?: object;
}

const GenderPicker = ({
                          initialValue = 'male',
                          onChange,
                          style
                      }: GenderPickerProps) => {

    const [selectedGender, setSelectedGender] = useState(initialValue);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // 同步外部初始值变化
    useEffect(() => {
        setSelectedGender(initialValue);
    }, [initialValue]);


    // 切换动画
    const animateSelection = (gender: 'male' | 'female') => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            setSelectedGender(gender);
            onChange?.(gender); // 触发回调
        });
    };


    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                onPress={() => animateSelection('male')}
                accessibilityLabel="选择男性"
            >
                <Ionicons
                    name="male-outline"
                    size={32}
                    color={selectedGender === 'male' ? '#1890ff' : '#666'}
                />
            </TouchableOpacity>

            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={[
                    styles.genderText,
                    selectedGender === 'male' ? styles.active : styles.inactive
                ]}>
                    {selectedGender === 'male' ? '男' : '女'}
                </Text>
            </Animated.View>

            <TouchableOpacity
                onPress={() => animateSelection('female')}
                accessibilityLabel="选择女性"
            >
                <Ionicons
                    name="female-outline"
                    size={32}
                    color={selectedGender === 'female' ? '#ff4d4f' : '#666'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    genderText: {
        fontSize: 24,
        marginHorizontal: 20,
        fontWeight: '100',
    },
    active: {
        color: '#1890ff',
        textShadowColor: 'rgba(24, 144, 255, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    inactive: {
        color: '#666',
    }
});

export default GenderPicker;
