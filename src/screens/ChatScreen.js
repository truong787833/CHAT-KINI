import React, { useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { AppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen({ route, navigation }) {
  const { chatId, chatName } = route.params;
  const { chats, sendMessage, isTyping } = useContext(AppContext);
  const [showStickers, setShowStickers] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const flatListRef = useRef();

  const chat = chats.find(c => c.id === chatId);
  const messages = chat ? chat.messages : [];

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isTyping[chatId]]);
  const handleSendSticker = (emoji) => {
    sendMessage(chatId, `[Sticker] ${emoji}`);
    setShowStickers(false);
  };

  const handlePickMedia = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện ảnh!');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets) {
        res.assets.forEach(asset => {
          const isVid = asset.type === 'video' || asset.uri.endsWith('.mp4');
          sendMessage(chatId, `${isVid ? '[Video]' : '[Hình ảnh]'} ${asset.uri}`);
        });
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể chọn tệp.');
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      Alert.alert('Ghi âm', 'Đang ghi âm giọng nói... Nhấn OK để gửi.', [
        { text: 'OK', onPress: () => { setIsRecording(false); sendMessage(chatId, '[Tin nhắn thoại 🎙️ 0:05s]'); } }
      ]);
    } else {
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text);
    setText('');
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === 'me';
    const isImage = item.text.startsWith('[Hình ảnh]');
    const isVideo = item.text.startsWith('[Video]');
    const isSticker = item.text.startsWith('[Sticker]');

    return (
      <View style={[styles.row, isMe ? styles.myR : styles.othR]}>
        {!isMe && (
          <View style={styles.av}><Text style={styles.avT}>{chatName.substring(0, 2).toUpperCase()}</Text></View>
        )}
        <View style={[styles.bubble, isMe ? styles.myB : styles.othB, (isImage || isVideo || isSticker) && { backgroundColor: 'transparent', padding: 0 }]}>
          {isImage ? (
            <Image source={{ uri: item.text.replace('[Hình ảnh] ', '') }} style={styles.mediaImg} resizeMode="cover" />
          ) : isVideo ? (
            <View style={styles.videoBox}>
              <Ionicons name="play-circle" size={40} color="#fff" style={{ position: 'absolute' }} />
              <View style={{ width: 200, height: 120, backgroundColor: '#333', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 12, marginTop: 40 }}>Video (&lt; 1GB)</Text>
              </View>
            </View>
          ) : isSticker ? (
            <Text style={{ fontSize: 40 }}>{item.text.replace('[Sticker] ', '')}</Text>
          ) : (
            <Text style={[styles.txt, isMe ? styles.myTxt : styles.othTxt]}>{item.text}</Text>
          )}
          <Text style={[styles.time, isMe ? { color: 'rgba(255,255,255,0.7)' } : {}]}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.textDark} /></TouchableOpacity>
        <View style={styles.hInfo}>
          <Text style={styles.hName} numberOfLines={1}>{chatName}</Text>
          <Text style={styles.hStatus}>{chat?.isOnline ? 'Đang hoạt động' : 'Vừa mới truy cập'}</Text>
        </View>
        <View style={styles.acts}>
          <TouchableOpacity style={styles.act}><Ionicons name="call-outline" size={22} color={colors.textDark} /></TouchableOpacity>
          <TouchableOpacity style={styles.act}><Ionicons name="videocam-outline" size={22} color={colors.textDark} /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping[chatId] ? (
            <View style={styles.row}>
              <View style={styles.av}><Text style={styles.avT}>{chatName.substring(0, 2).toUpperCase()}</Text></View>
              <View style={[styles.bubble, styles.othB]}><Text style={styles.typ}>{chatName} đang soạn tin...</Text></View>
            </View>
          ) : null
        }
      />

      {showStickers && (
        <View style={styles.stickerPanel}>
          {['😊', '😂', '❤️', '👍', '🔥', '🎉', '😎', '😍', '👏', '✨', '🎁', '🚀'].map((emoji, index) => (
            <TouchableOpacity key={index} onPress={() => handleSendSticker(emoji)} style={styles.stickerBtn}>
              <Text style={{ fontSize: 28 }}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.pBtn} onPress={() => setShowStickers(!showStickers)}>
            <Ionicons name="happy-outline" size={24} color={showStickers ? colors.primary : colors.textGray} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Tin nhắn (Ảnh < 10MB, Video < 1GB)..."
            value={text}
            onChangeText={setText}
            placeholderTextColor={colors.textGray}
          />
          {text.trim() ? (
            <TouchableOpacity style={styles.pBtn} onPress={handleSend}><Ionicons name="send" size={22} color={colors.primary} /></TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.pBtn} onPress={handlePickMedia}><Ionicons name="images-outline" size={24} color={colors.textGray} /></TouchableOpacity>
              <TouchableOpacity style={styles.pBtn} onPress={handleToggleRecord}>
                <Ionicons name={isRecording ? "mic" : "mic-outline"} size={24} color={isRecording ? colors.error : colors.textGray} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBEFF4' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border },
  hInfo: { flex: 1, marginLeft: 12 },
  hName: { fontSize: 16, fontWeight: 'bold', color: colors.textDark },
  hStatus: { fontSize: 11, color: colors.online },
  acts: { flexDirection: 'row' },
  act: { padding: 8, marginLeft: 4 },
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', maxWidth: '80%' },
  myR: { alignSelf: 'flex-end' },
  othR: { alignSelf: 'flex-start' },
  av: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.textGray, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avT: { color: colors.white, fontSize: 11, fontWeight: 'bold' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, elevation: 1 },
  myB: { backgroundColor: colors.primaryLight, borderBottomRightRadius: 2 },
  othB: { backgroundColor: colors.white, borderBottomLeftRadius: 2 },
  txt: { fontSize: 15, color: colors.textDark, lineHeight: 20 },
  time: { fontSize: 9, color: colors.textGray, marginTop: 4, alignSelf: 'flex-end' },
  typ: { fontSize: 13, color: colors.textGray, fontStyle: 'italic' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderColor: colors.border },
  pBtn: { padding: 8 },
  input: { flex: 1, backgroundColor: '#F4F5F7', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, maxHeight: 100, fontSize: 15, color: colors.textDark, marginHorizontal: 4 },
  mediaImg: { width: 200, height: 150, borderRadius: 12 },
  videoBox: { width: 200, height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  stickerPanel: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.white, padding: 12, borderTopWidth: 1, borderColor: colors.border, justifyContent: 'space-around' },
  stickerBtn: { padding: 8 },
});
