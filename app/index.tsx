import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
  const [albums, setAlbums] = useState<MediaLibrary.Album[] | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    console.log(fetchedAlbums);
    setAlbums(fetchedAlbums);
  }


  const handleUpload = () => {
    console.log('Upload');

    getAlbums();
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
});