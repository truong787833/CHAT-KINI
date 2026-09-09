import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, ScrollView, Modal, TextInput, Share } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile } = useContext(AppContext);

  const [modalType, setModalType] = useState(null);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'ME');

  const [allowStrangerMessage, setAllowStrangerMessage] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout }
    ]);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Tên không được để trống!');
      return;
    }
    updateUserProfile({
      name: editName,
      bio: editBio,
      avatar: editAvatar.substring(0, 3).toUpperCase()
    });
    setModalType(null);
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân!');
  };

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Kết bạn với tôi trên KINI Chat! SĐT: ${user?.phone} - Mã QR: KINI_USER_${user?.phone}`,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ mã QR.');
    }
  };

  const handleCheckForUpdate = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateAvailable(true);
      Alert.alert('Thông báo', 'Đã tìm thấy phiên bản KINI mới nhất (v1.8.47 - Build 16)! Sẵn sàng cài đặt.');
    }, 1200);
  };

  const handleStartUpdate = () => {
    Alert.alert('Cập nhật', 'Đang tải xuống bản KINI mới từ GitHub và chuẩn bị cài đặt...', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Cài đặt ngay', onPress: () => { Alert.alert('Thành công', 'Đã cập nhật ứng dụng thành công!'); setUpdateAvailable(false); } }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.avatar || 'ME'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Kini User'}</Text>
        <Text style={styles.phone}>{user?.phone || '0901234567'}</Text>
        <Text style={styles.bio}>{user?.bio || 'Sống là chia sẻ và kết nối!'}</Text>
      </View>
          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={() => {
              setEditName(user?.name || '');
              setEditBio(user?.bio || '');
              setEditAvatar(user?.avatar || 'ME');
              setModalType('edit');
            }}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text style={styles.editProfileText}>Chỉnh sửa thông tin</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalType('account')}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Tài khoản và bảo mật</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setModalType('privacy')}>
          <Ionicons name="lock-closed-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Quyền riêng tư</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setModalType('qr')}>
          <Ionicons name="qr-code-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Mã QR của tôi</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setModalType('update')}>
          <Ionicons name="cloud-download-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Cập nhật ứng dụng (GitHub)</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>
          </TouchableOpacity>

      {/* Options List */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Tài khoản và bảo mật</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Quyền riêng tư</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="qr-code-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuText}>Mã QR của tôi</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.error }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBEFF4' },
  banner: { backgroundColor: colors.white, alignItems: 'center', paddingVertical: 30, marginBottom: 12 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  avatarText: { color: colors.white, fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: colors.textDark, marginBottom: 4 },
  phone: { fontSize: 14, color: colors.textGray, marginBottom: 8 },
  bio: { fontSize: 13, color: colors.textDark, fontStyle: 'italic' },
  menu: { backgroundColor: colors.white },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.border },
  menuIcon: { marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, color: colors.textDark },
});
