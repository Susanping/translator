import { Button, Linking, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 如何开始录屏</Text>
      <Text style={styles.text}>
        1. 打开控制中心 {'\n'}
        2. 长按录屏按钮 {'\n'}
        3. 选择本 App {'\n'}
        4. 点击开始录屏
      </Text>
      <Button title="打开设置 ➜ 控制中心" onPress={() => {
        Linking.openURL('App-prefs:root=ControlCenter');
      }} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    marginVertical: 10,
  }
});