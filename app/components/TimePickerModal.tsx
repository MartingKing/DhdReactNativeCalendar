import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface TimePickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (time: { hours: number; minutes: number; seconds: number }) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({isVisible, onClose, onConfirm}) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const handleConfirm = () => {
        onConfirm({hours, minutes, seconds});
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
            transparent={true}
            style={styles.modal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>选择时间</Text>

                    <View style={styles.pickerContainer}>
                        {/* 小时选择器 */}
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={hours}
                                onValueChange={setHours}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {[...Array(24).keys()].map((hour) => (
                                    <Picker.Item
                                        key={hour}
                                        label={`${hour} 时`}  // 添加单位
                                        value={hour}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* 分钟选择器 */}
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={minutes}
                                onValueChange={setMinutes}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {[...Array(60).keys()].map((minute) => (
                                    <Picker.Item
                                        key={minute}
                                        label={`${minute} 分`}  // 添加单位
                                        value={minute}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* 秒钟选择器 */}
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={seconds}
                                onValueChange={setSeconds}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {[...Array(60).keys()].map((second) => (
                                    <Picker.Item
                                        key={second}
                                        label={`${second} 秒`}  // 添加单位
                                        value={second}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <Button title="确认" onPress={handleConfirm} />
                </View>
            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerWrapper: {
        flex: 1,
        marginHorizontal: 4,  // 增加间距
    },
    picker: {
        width: '100%',        // 设置宽度
        height: 40,          // 增加高度
    },
    pickerItem: {
        fontSize: 18,         // 增大字体
        textAlign: 'center',  // 文字居中
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,     // 增大圆角
        width: '92%',         // 增加宽度
        maxWidth: 420,        // 增大最大宽度
    },
});

export default TimePickerModal;
