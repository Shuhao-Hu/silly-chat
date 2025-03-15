import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface CloseProps {
  style?: StyleProp<ViewStyle>;
  onPressHandler?: () => void;
}

export default function Close({
  style,
  onPressHandler  
}: CloseProps) {
  return (
    <TouchableOpacity onPress={onPressHandler} style={style}>
      <Image source={require("@/assets/images/close.png")} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  )
}