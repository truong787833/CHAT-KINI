import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const initialChats = [
  {
    id: '1',
    name: 'KINI AI',
    avatar: 'AI',
    isOnline: true,
    unreadCount: 1,
    messages: [{ id: '101', senderId: '1', text: 'Xin chào! Tôi là KINI AI. Tôi có thể giúp gì cho bạn hôm nay? 🤖✨', timestamp: '15:30' }]
  }
];

const initialContacts = [
  { id: '1', name: 'KINI AI', phone: '0900000000', avatar: 'AI', isOnline: true }
];

const initialPosts = [
  {
    id: '1',
    author: 'KINI AI',
    avatar: 'AI',
    timestamp: '2 giờ trước',
    content: '🚀 KINI CHÍNH THỨC RA MẮT BẢN THỬ NGHIỆM! \n\nỨng dụng chat di động siêu mượt mà với trợ lý KINI AI thông minh! Trải nghiệm và chia sẻ góp ý nhé! ❤️📱',
    likes: [],
    comments: []
  }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState(initialChats);
  const [contacts, setContacts] = useState(initialContacts);
  const [posts, setPosts] = useState(initialPosts);
  const [isTyping, setIsTyping] = useState({});

  const login = (phone, password) => {
    if (!phone || !password) return { success: false, message: 'Nhập đủ thông tin!' };
    setUser({ id: 'me', name: 'Bạn (Kini User)', phone, avatar: 'ME', bio: 'Sống là chia sẻ!' });
    return { success: true };
  };

  const register = (name, phone, password) => {
    if (!name || !phone || !password) return { success: false, message: 'Nhập đủ thông tin!' };
    setUser({ id: 'me', name, phone, avatar: name.substring(0, 2).toUpperCase(), bio: 'Chào mừng!' });
    return { success: true };
  };

  const resetPassword = (phone, newPassword) => {
    if (!phone || !newPassword) return { success: false, message: 'Nhập đủ thông tin!' };
    return { success: true, message: 'Đặt lại mật khẩu thành công! Hãy đăng nhập lại bằng mật khẩu mới.' };
  };

  const logout = () => setUser(null);

  const sendMessage = (chatId, text) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { id: Date.now().toString(), senderId: 'me', text, timestamp: time };

    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0, messages: [...c.messages, newMessage] } : c));
    setIsTyping(prev => ({ ...prev, [chatId]: true }));

    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [chatId]: false }));
      let reply = `KINI AI đã ghi nhận câu hỏi: "${text}". Tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào! 🤖💡`;
      const clean = text.toLowerCase();
      if (clean.includes('bạn là ai') || clean.includes('tên gì')) {
        reply = 'Tôi là KINI AI - Trợ lý thông minh tích hợp trong ứng dụng KINI! 🤖✨';
      } else if (clean.includes('thời tiết') || clean.includes('nắng') || clean.includes('mưa')) {
        reply = 'Hôm nay thời tiết rất đẹp để trải nghiệm ứng dụng KINI đấy bạn nhé! ☀️';
      } else if (clean.includes('chào') || clean.includes('hi') || clean.includes('hello')) {
        reply = 'Xin chào bạn! Tôi có thể giúp gì cho bạn hôm nay? 👋';
      } else if (clean.includes('tính năng') || clean.includes('làm được gì')) {
        reply = 'Tôi có thể trả lời câu hỏi, trò chuyện, hỗ trợ tra cứu thông tin và đồng hành cùng bạn trên KINI! 🚀';
      }

      const replyMsg = { id: (Date.now() + 1).toString(), senderId: chatId, text: reply, timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0, messages: [...c.messages, replyMsg] } : c));
    }, 1200);
  };

  const clearUnread = (chatId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  const addPost = (content) => {
    if (!content.trim()) return;
    setPosts([{ id: Date.now().toString(), author: user?.name || 'Bạn', avatar: user?.avatar || 'ME', timestamp: 'Vừa xong', content, likes: [], comments: [] }, ...posts]);
  };

  const toggleLikePost = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.includes('me') ? p.likes.filter(id => id !== 'me') : [...p.likes, 'me'] } : p));
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const comment = { id: Date.now().toString(), author: user?.name || 'Bạn', text, timestamp: 'Vừa xong' };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  const addContact = (name, phone) => {
    if (!name || !phone) return { success: false, message: 'Nhập thiếu thông tin!' };
    const id = Date.now().toString();
    setContacts([...contacts, { id, name, phone, avatar: name.substring(0, 2).toUpperCase(), isOnline: false, lastSeen: 'Đã kết bạn' }]);
    setChats([{ id, name, avatar: name.substring(0, 2).toUpperCase(), isOnline: false, unreadCount: 0, messages: [{ id: (Date.now()+1).toString(), senderId: id, text: `Chúng ta đã kết bạn, hãy nhắn tin cho ${name} nhé! 👋`, timestamp: 'Vừa xong' }] }, ...chats]);
    return { success: true };
  };

  return (
    <AppContext.Provider value={{ user, chats, contacts, posts, isTyping, login, register, resetPassword, logout, sendMessage, clearUnread, addPost, toggleLikePost, addComment, addContact }}>
      {children}
    </AppContext.Provider>
  );
};
