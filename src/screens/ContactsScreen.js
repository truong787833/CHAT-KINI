import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ContactsScreen({ navigation }) {
  const { contacts, addContact } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const getAvBg = (name) => {
    const list = ['#FF5733', '#33FF57', '#3357FF', '#FF33F3', '#33FFF3', colors.primary];
    return list[name.charCodeAt(0) % list.length];
  };

  const handleAdd = () => {
    if (!newPhone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại!');
      return;
    }
    const res = addContact(newPhone);
    if (res.success) {
      Alert.alert('Thành công', `Đã tìm thấy và kết bạn với ${res.name}!`);
      setNewPhone(''); setShowAdd(false);
    } else {
      Alert.alert('Thông báo', res.message);
    }
  };

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.avW}>
        <View style={[styles.av, { backgroundColor: getAvBg(item.name) }]}><Text style={styles.avT}>{item.avatar}</Text></View>
        {item.isOnline && <View style={styles.on} />}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone} • {item.isOnline ? 'Online' : item.lastSeen}</Text>
      </View>
      <TouchableOpacity style={styles.cBtn} onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.name })}>
        <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
        <Text style={styles.cBtnT}> Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="search" size={20} color={colors.white} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm danh bạ..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={{ padding: 4 }} onPress={() => setShowAdd(!showAdd)}>
          <Ionicons name={showAdd ? "close-circle" : "person-add"} size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.add}>
          <Text style={styles.addT}>Thêm bạn mới bằng Số điện thoại</Text>
          <TextInput style={styles.input} placeholder="Nhập số điện thoại cần tìm..." value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" placeholderTextColor={colors.textGray} />
          <TouchableOpacity style={styles.btn} onPress={handleAdd}><Text style={styles.btnT}>TÌM & KẾT BẠN</Text></TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.div} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textGray} />
            <Text style={{ marginTop: 12, color: colors.textGray }}>Không tìm thấy liên hệ nào</Text>
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
  add: { backgroundColor: '#F4F5F7', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  addT: { fontSize: 14, fontWeight: 'bold', color: colors.textDark, marginBottom: 10 },
  input: { backgroundColor: colors.white, height: 40, borderRadius: 6, paddingHorizontal: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border, fontSize: 14, color: colors.textDark },
  btn: { backgroundColor: colors.primary, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  btnT: { color: colors.white, fontWeight: 'bold', fontSize: 13 },
  item: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  avW: { position: 'relative', marginRight: 12 },
  av: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avT: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
  on: { position: 'absolute', bottom: 0, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.online, borderWidth: 2, borderColor: colors.white },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: 'bold', color: colors.textDark, marginBottom: 2 },
  phone: { fontSize: 11, color: colors.textGray },
  cBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.primary },
  cBtnT: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  div: { height: 1, backgroundColor: colors.border, marginLeft: 72 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
});
