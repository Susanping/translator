import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

import * as ImagePicker from 'expo-image-picker';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];


type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    console.log("result", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const handleUpload = () => {
    pickImage();
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>🎥 如何开始录屏</Text>
      <Text style={styles.text}>
        1. 打开控制中心 {'\n'}
        2. 长按录屏按钮 {'\n'}
        3. 选择本 App {'\n'}
        4. 点击开始录屏
      </Text>
      <Button title="打开设置 ➜ 控制中心" onPress={() => {
        Linking.openURL('App-prefs:root=ControlCenter');
      }} /> */}

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleUpload}>
          <FontAwesome name="upload" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonLabel}>Upload</Text>
        </Pressable>
      </View>

      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
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
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    textAlign: 'center',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: '#25292e',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});