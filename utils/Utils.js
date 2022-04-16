import Toast from "react-native-toast-message";
import { View } from "native-base";
import Modal from "react-native-modal";
import { Text } from "@rneui/base";

export function showToast (type, title, text) {
  Toast.show({
    type: type,
    position: "bottom",
    text1: title,
    text2: text,
  });
}
