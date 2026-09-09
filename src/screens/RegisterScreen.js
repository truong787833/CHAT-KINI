import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { register } = useContext(AppContext);

  const handleRegister = () => {
    if (!name || !phone || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    const result = register(name, phone, password);
    if (!result.success) Alert.alert('Thông báo', result.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logo}>Kini</Text>
            <Text style={styles.tag}>Đăng ký tài khoản mới</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color={colors.textGray} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} placeholderTextColor={colors.textGray} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="phone-portrait-outline" size={20} color={colors.textGray} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.textGray} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textGray} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry={secureText} placeholderTextColor={colors.textGray} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.textGray} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={secureText} placeholderTextColor={colors.textGray} />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textGray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>ĐĂNG KÝ</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.label}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}> Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: { position: 'absolute', top: 20, left: 20, zIndex: 1, padding: 8 },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 40, fontWeight: 'bold', color: colors.primary },
  tag: { fontSize: 16, color: colors.textGray, marginTop: 6 },
  form: { width: '100%' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, marginBottom: 16, height: 50, backgroundColor: '#F9FAFC' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: colors.textDark },
  btn: { backgroundColor: colors.primary, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 24, elevation: 3 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  label: { color: colors.textGray, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontWeight: 'bold' },
});
