import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AutomaticSpeechRecognitionPipeline, pipeline } from '@xenova/transformers';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    console.log('result', result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    pickImage();
  };

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [transcriber, setTranscriber] = useState<AutomaticSpeechRecognitionPipeline | null>(null);

  useEffect(() => {
    const loadTranscriber = async () => {
      try {
        // 使用transformers.js加载轻量级的whisper模型
        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
        setIsModelLoaded(true);
        setTranscriber(transcriber);
      } catch (error) {
        console.error('Failed to load transcriber:', error);
      }
    };

    // loadTranscriber();
    requestPermissions();
  }, []);

  // 请求录音权限
  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setAudioPermission(status === 'granted');
  };

  // 开始录音
  const startRecording = async () => {
    if (!audioPermission || isRecording || isProcessing) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // 停止录音并开始转录
  const stopRecording = async () => {
    if (!recording || !isRecording) return;

    setIsRecording(false);
    setIsProcessing(true);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    try {
      // 使用加载的模型进行转录
      if (transcriber) {
        const result = await transcriber(uri as any);
        setTranscript(result.text as string);
      } else {
        console.error('Transcriber not loaded');
      }
    } catch (error) {
      console.error('Error during transcription:', error);
    } finally {
      setIsProcessing(false);
      setRecording(null);
    }
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

      {!audioPermission && <Text style={styles.error}>请授予录音权限</Text>}

      {isProcessing ? (
        <Text style={styles.processing}>正在处理音频...</Text>
      ) : (
        <Button
          title={isRecording ? '停止录音' : '开始录音'}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!audioPermission || isProcessing}
        />
      )}

      <View style={styles.transcriptBox}>
        <Text style={styles.transcriptTitle}>识别结果:</Text>
        <Text style={styles.transcriptText}>{transcript || '暂无内容'}</Text>
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleUpload}>
          <FontAwesome name="upload" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonLabel}>Upload</Text>
        </Pressable>
      </View>

      <FlatList data={DATA} renderItem={({ item }) => <Item title={item.title} />} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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

  error: {
    color: 'red',
    marginBottom: 10,
  },
  processing: {
    marginBottom: 10,
    fontStyle: 'italic',
  },
  transcriptBox: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  transcriptTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transcriptText: {
    minHeight: 100,
  },
});
