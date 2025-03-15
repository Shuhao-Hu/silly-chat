import { Image, StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface CheckProps {
  style?: StyleProp<ViewStyle>;
  onPressHandler?: () => void;
}

export default function Check({
  style,
  onPressHandler  
}: CheckProps) {
  return (
    <TouchableOpacity onPress={onPressHandler} style={style}>
      <Image source={require("@/assets/images/check.png")} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>
  )
}