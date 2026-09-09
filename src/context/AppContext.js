import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const initialChats = [
  {
    id: '1',
    name: 'Kini Assistant',
    avatar: 'KA',
    isOnline: true,
    unreadCount: 1,
    messages: [{ id: '101', senderId: '1', text: 'Chào mừng bạn đến với Kini - ứng dụng nhắn tin phong cách Zalo! 🎉 Nhắn tin cho mình nhé!', timestamp: '15:30' }]
  },
  {
    id: '2',
    name: 'Nguyễn Văn Nam',
    avatar: 'VN',
    isOnline: true,
    unreadCount: 0,
    messages: [
      { id: '201', senderId: '2', text: 'Chiều nay làm cốc bia giải mỏi không ông ơi? 🍺', timestamp: '14:20' },
      { id: '202', senderId: 'me', text: 'Hợp lý đấy!', timestamp: '14:22' }
    ]
  }
];

const initialContacts = [
  { id: '1', name: 'Kini Assistant', phone: '0901234567', avatar: 'KA', isOnline: true },
  { id: '2', name: 'Nguyễn Văn Nam', phone: '0912345678', avatar: 'VN', isOnline: true },
  { id: '3', name: 'Trần Thị Lan', phone: '0987654321', avatar: 'TL', isOnline: false, lastSeen: 'Vừa mới truy cập' }
];

const initialPosts = [
  {
    id: '1',
    author: 'Kini Assistant',
    avatar: 'KA',
    timestamp: '2 giờ trước',
    content: '🚀 KINI CHÍNH THỨC RA MẮT BẢN THỬ NGHIỆM! \n\nỨng dụng chat di động siêu mượt mà, bảo mật tuyệt đối, mượt như Zalo! Trải nghiệm và chia sẻ góp ý nhé! ❤️📱',
    likes: ['2'],
    comments: [{ id: '101', author: 'Nguyễn Văn Nam', text: 'App chạy mượt thật sự! UI quá đẹp.', timestamp: '1 giờ trước' }]
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

  const logout = () => setUser(null);

  const sendMessage = (chatId, text) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { id: Date.now().toString(), senderId: 'me', text, timestamp: time };

    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0, messages: [...c.messages, newMessage] } : c));
    setIsTyping(prev => ({ ...prev, [chatId]: true }));

    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [chatId]: false }));
      let reply = 'Cảm ơn bạn đã nhắn tin cho Kini! Mình sẽ trả lời sớm nhất có thể. 👍';
      const clean = text.toLowerCase();
      if (chatId === '1') {
        if (clean.includes('bạn là ai') || clean.includes('tên gì')) reply = 'Mình là Trợ lý Kini! 🤖';
        else if (clean.includes('tính năng') || clean.includes('chức năng')) reply = 'Kini hỗ trợ Nhắn tin thời gian thực, Danh bạ, Nhật ký đăng bài, thả tim, bình luận và Profile cá nhân!';
        else if (clean.includes('chào') || clean.includes('hi') || clean.includes('hello')) reply = 'Chào bạn nha! Rất vui được trò chuyện với bạn.';
      } else if (chatId === '2') {
        if (clean.includes('nhậu') || clean.includes('bia')) reply = 'Chốt kèo 6h chiều nhé! Quán lòng nướng cũ ông ơi! 🍻';
        else reply = 'Tôi đang bận xíu, lát tôi nhắn tin lại sau nhé!';
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
    <AppContext.Provider value={{ user, chats, contacts, posts, isTyping, login, register, logout, sendMessage, clearUnread, addPost, toggleLikePost, addComment, addContact }}>
      {children}
    </AppContext.Provider>
  );
};
