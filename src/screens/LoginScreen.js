import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { login, resetPassword } = useContext(AppContext);

  const handleLogin = () => {
    const result = login(phone, password);
    if (!result.success) {
      Alert.alert('Thông báo', result.message);
    }
  };

  const handleForgot = () => {
    if (!forgotPhone || !newPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại và mật khẩu mới!');
      return;
    }
    const result = resetPassword(forgotPhone, newPassword);
    Alert.alert('Thông báo', result.message);
    if (result.success) {
      setIsForgotMode(false);
      setPhone(forgotPhone);
      setNewPassword('');
    }
  };

  if (isForgotMode) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.logoText}>Kini</Text>
              <Text style={styles.tagline}>Khôi phục mật khẩu</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.title}>QUÊN MẬT KHẨU</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.textGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại đăng ký"
                  value={forgotPhone}
                  onChangeText={setForgotPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textGray}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={secureText}
                  placeholderTextColor={colors.textGray}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                  <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textGray} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginBtn} onPress={handleForgot}>
                <Text style={styles.loginBtnText}>ĐẶT LẠI MẬT KHẨU</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.textGray, marginTop: 12 }]} onPress={() => setIsForgotMode(false)}>
                <Text style={styles.loginBtnText}>QUAY LẠI ĐĂNG NHẬP</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logoText}>Kini</Text>
            <Text style={styles.tagline}>Kết nối & Sẻ chia</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>ĐĂNG NHẬP</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="phone-portrait-outline" size={20} color={colors.textGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={colors.textGray}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                placeholderTextColor={colors.textGray}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textGray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn} onPress={() => setIsForgotMode(true)}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerLabel}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}> Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    backgroundColor: '#F9FAFC',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 24,
  },
  loginBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLabel: {
    color: colors.textGray,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
