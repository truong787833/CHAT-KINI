import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TimelineScreen() {
  const { posts, addPost, toggleLikePost, addComment, user } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [cmtTexts, setCmtTexts] = useState({});

  const handlePost = () => { if (content.trim()) { addPost(content); setContent(''); } };
  const handleCmt = (id) => {
    const txt = cmtTexts[id];
    if (txt?.trim()) { addComment(id, txt); setCmtTexts(p => ({ ...p, [id]: '' })); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EBEFF4' }}>
      <View style={styles.header}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Nhật ký Kini</Text>
        <Ionicons name="camera" size={24} color="#fff" />
      </View>
      <FlatList
        data={posts} keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.composer}>
            <View style={styles.av}><Text style={{ color: '#fff', fontWeight: 'bold' }}>{user?.avatar || 'ME'}</Text></View>
            <TextInput
              style={{ flex: 1, fontSize: 15, maxHeight: 60 }} placeholder="Hôm nay bạn thế nào?" placeholderTextColor={colors.textGray}
              value={content} onChangeText={setContent} multiline
            />
            {content.trim() ? <TouchableOpacity style={styles.pBtn} onPress={handlePost}><Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Đăng</Text></TouchableOpacity> : null}
          </View>
  const handlePickMedia = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện!');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: false,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setMediaUri(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh/video.');
    }
  };

  const handlePost = () => {
    if (content.trim() || mediaUri) {
      addPost(content, mediaUri);
      setContent('');
      setMediaUri(null);
    }
  };
        }
        renderItem={({ item }) => {
          const liked = item.likes.includes('me');
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={[styles.av, { backgroundColor: '#FF5733' }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.avatar}</Text></View>
                <View>
                  <Text style={{ fontWeight: 'bold', color: colors.textDark }}>{item.author}</Text>
                  <Text style={{ fontSize: 10, color: colors.textGray }}>{item.timestamp}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: colors.textDark, lineHeight: 20, marginBottom: 10 }}>{item.content}</Text>
              <View style={styles.bar}>
                <TouchableOpacity style={styles.btn} onPress={() => toggleLikePost(item.id)}>
                  <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? colors.error : colors.textGray} />
                  <Text style={{ fontSize: 12, color: liked ? colors.error : colors.textGray, marginLeft: 4 }}>{item.likes.length} Thích</Text>
                </TouchableOpacity>
                <View style={styles.btn}>
                  <Ionicons name="chatbubble-outline" size={18} color={colors.textGray} />
                  <Text style={{ fontSize: 12, color: colors.textGray, marginLeft: 4 }}>{item.comments.length} Bình luận</Text>
                </View>
              </View>
              {item.comments.map(c => (
                <View key={c.id} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 12, color: colors.textDark }}>{c.author}: </Text>
                  <Text style={{ fontSize: 12, color: colors.textDark }}>{c.text}</Text>
                </View>
              ))}
              <View style={styles.cInputRow}>
                <TextInput
                  style={{ flex: 1, fontSize: 12, color: colors.textDark, padding: 0 }} placeholder="Bình luận..." placeholderTextColor={colors.textGray}
                  value={cmtTexts[item.id] || ''} onChangeText={(t) => setCmtTexts(p => ({ ...p, [item.id]: t }))}
                />
                <TouchableOpacity onPress={() => handleCmt(item.id)}><Ionicons name="send" size={16} color={colors.primary} /></TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  composer: { flexDirection: 'row', backgroundColor: '#fff', padding: 14, marginBottom: 8, alignItems: 'center' },
  av: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  pBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  card: { backgroundColor: '#fff', padding: 14, marginBottom: 8 },
  bar: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 6, marginBottom: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  cInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F5F7', borderRadius: 14, paddingHorizontal: 10, height: 32, marginTop: 6 },
});
