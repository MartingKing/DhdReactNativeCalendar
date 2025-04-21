// RadioGroup.tsx
import React, {useEffect, useRef} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    Animated,
} from 'react-native';

export type RadioOption<T extends string = string> = {
    label: string;
    value: T;
    disabled?: boolean;
    customElement?: React.ReactNode; // 自定义显示元素
};

interface RadioGroupProps<T extends string = string> {
    options: RadioOption<T>[];
    selectedValue?: T;
    onValueChange?: (value: T) => void;
    direction?: 'horizontal' | 'vertical';
    containerStyle?: StyleProp<ViewStyle>;
    radioStyle?: {
        size?: number;
        color?: string;
        selectedColor?: string;
        borderWidth?: number;
    };
    labelStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
    animationDuration?: number;
    gap?: number;
}

const RadioGroup = <T extends string = string>({
                                                   options,
                                                   selectedValue,
                                                   onValueChange,
                                                   direction = 'horizontal',
                                                   containerStyle,
                                                   radioStyle,
                                                   labelStyle,
                                                   disabledStyle,
                                                   animationDuration = 200,
                                                   gap = 12,
                                               }: RadioGroupProps<T>) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const isValidValue = options.some(opt => opt.value === selectedValue);
    const displayValue = isValidValue ? selectedValue : options[0]?.value;
    const {
        size = 24,
        color = '#1890ff',
        selectedColor = '#1890ff',
        borderWidth = 2,
    } = radioStyle || {};

    useEffect(() => {
        // 当值变化时触发动画
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();

        // 重置动画值当组件卸载时
        return () => {
            scaleValue.setValue(0);
        };
    }, [displayValue]);

    const handlePress = (value: T) => {
        const option = options.find(opt => opt.value === value);
        if (!option || option.disabled) return;
        onValueChange?.(value);
    };

    return (
        <View
            style={[
                styles.container,
                direction === 'vertical' && styles.verticalContainer,
                containerStyle,
                {gap},
            ]}
        >
            {options.map(option => {
                const isSelected = option.value === displayValue;
                const isDisabled = option.disabled;

                return (
                    <TouchableOpacity
                        key={option.value}
                        activeOpacity={0.7}
                        onPress={() => handlePress(option.value)}
                        disabled={isDisabled}
                        accessibilityRole="radio"
                        accessibilityState={{checked: isSelected}}
                        style={[styles.option, isDisabled && disabledStyle]}
                    >
                        {/* 单选按钮 */}
                        <Animated.View
                            style={[
                                styles.radioBase,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                    borderColor: isSelected ? selectedColor : color,
                                    borderWidth,
                                },
                                isSelected && {
                                    transform: [{scale: scaleValue}],
                                },
                            ]}
                        >
                            {isSelected && (
                                <View
                                    style={[
                                        styles.radioSelected,
                                        {
                                            width: size * 0.6,
                                            height: size * 0.6,
                                            borderRadius: size * 0.3,
                                            backgroundColor: selectedColor,
                                        },
                                    ]}
                                />
                            )}
                        </Animated.View>

                        {/* 自定义内容或默认标签 */}
                        {option.customElement || (
                            <Text
                                style={[
                                    styles.label,
                                    labelStyle,
                                    isDisabled && styles.disabledLabel,
                                ]}
                            >
                                {option.label}
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    verticalContainer: {
        flexDirection: 'row',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    radioBase: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        position: 'absolute',
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    disabledLabel: {
        color: '#999',
    },
});

export default RadioGroup;
