import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle, StyleProp } from 'react-native';

interface ButtonProps {
  activeOpacity?: number;
  buttonStyle?: StyleProp<ViewStyle>;
  onPressHandler?: () => void;
  buttonText?: string;
}

export default function Button({
  activeOpacity = 0.7,
  buttonStyle,
  onPressHandler,
  buttonText = 'button',
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[
        {
          backgroundColor: '#3498db', // Default color
          alignItems: 'center', // Center horizontally
          justifyContent: 'center', // Center vertically
        },
        buttonStyle, // Allow custom styles to override defaults
      ]}
      onPress={onPressHandler}
    >
      <View>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  )
}
