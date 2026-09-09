import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { chats, clearUnread } = useContext(AppContext);
  const [search, setSearch] = useState('');

  const getAvatarBg = (name) => {
    const list = ['#FF5733', '#33FF57', '#3357FF', '#FF33F3', '#33FFF3', colors.primary];
    return list[name.charCodeAt(0) % list.length];
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const renderChatItem = ({ item }) => {
    const lastMsg = item.messages[item.messages.length - 1];
    const lastMsgText = lastMsg ? (lastMsg.senderId === 'me' ? `Bạn: ${lastMsg.text}` : lastMsg.text) : 'Chưa có tin nhắn';
    return (
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => {
          clearUnread(item.id);
          navigation.navigate('Chat', { chatId: item.id, chatName: item.name });
        }}
      >
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: getAvatarBg(item.name) }]}>
            <Text style={styles.avatarTxt}>{item.avatar}</Text>
          </View>
          {item.isOnline && <View style={styles.online} />}
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.time}>{lastMsg ? lastMsg.timestamp : ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.msg, item.unreadCount > 0 && styles.unreadMsg]} numberOfLines={1}>{lastMsgText}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeTxt}>{item.unreadCount}</Text></View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Ionicons name="search" size={20} color={colors.white} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.icon}><Ionicons name="qr-code-outline" size={22} color={colors.white} /></TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('ContactsTab')}><Ionicons name="add" size={26} color={colors.white} /></TouchableOpacity>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textGray} />
            <Text style={{ marginTop: 12, color: colors.textGray }}>Không có cuộc hội thoại nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  search: { flex: 1, color: colors.white, fontSize: 16, height: 40 },
  icon: { marginLeft: 16, padding: 4 },
  item: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' },
  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  online: { position: 'absolute', bottom: 0, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.online, borderWidth: 2, borderColor: colors.white },
  info: { flex: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.textDark, flex: 1, marginRight: 10 },
  time: { fontSize: 12, color: colors.textGray },
  msg: { fontSize: 14, color: colors.textGray, flex: 1, marginRight: 10 },
  unreadMsg: { fontWeight: 'bold', color: colors.textDark },
  badge: { backgroundColor: colors.error, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 20, justifyContent: 'center', alignItems: 'center' },
  badgeTxt: { color: colors.white, fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 82 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
});
