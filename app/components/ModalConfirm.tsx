import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';

interface Props {
    visible: boolean;
    title?: string;
    content?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ModalConfirm = ({
                          visible,
                          title = '提示',
                          content = '确定要执行此操作吗？',
                          onConfirm,
                          onCancel,
                          confirmText = '确定',
                          cancelText = '取消'
                      }: Props) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel} // Android 返回键关闭
        >
            <View style={styles.mask}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.content}>{content}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    mask: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 4
            },
            android: {
                elevation: 5
            }
        })
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center'
    },
    content: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        flex: 1,
        borderRadius: 6,
        paddingVertical: 12,
        marginHorizontal: 4
    },
    cancelButton: {
        backgroundColor: '#f0f0f0'
    },
    confirmButton: {
        backgroundColor: '#1890ff'
    },
    cancelText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center'
    },
    confirmText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    }
});

export default ModalConfirm;
