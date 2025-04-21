// components/VerticalText.tsx
import React from 'react';
import {Text, View} from 'react-native';
import styles from '../styles/shiChenStyle';

interface VerticalTextProp {
    text: string;
}

const VerticalText: React.FC<VerticalTextProp> = ({ text }) => {
    return (
        <View style={styles.verticalTextContainer}>
            {text.split('').map((char, index) => (
                <Text key={index} style={styles.verticalText}>{char}</Text>
            ))}
        </View>
    );
};

export default React.memo(VerticalText);
