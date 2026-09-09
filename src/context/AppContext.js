import React, { createContext, useState, useEffect } from 'react';

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

const aiDailyWishes = [
  {
    content: "🌅 Chào buổi sáng! Chúc bạn ngày mới tràn đầy năng lượng, làm việc hiệu quả và luôn mỉm cười nhé! ☕✨",
    media: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
  },
  {
    content: "☀️ Chúc bạn một ngày mới an lành, vạn sự hanh thông và gặp nhiều may mắn trong cuộc sống! 🌸🚀",
    media: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600"
  },
  {
    content: "🌻 Ngày mới tuyệt vời đang chờ đón bạn! Hãy luôn tự tin, mạnh mẽ và tỏa sáng nhé! 💪❤️",
    media: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600"
  },
  {
    content: "🌟 Chúc bạn hôm nay thật nhiều niềm vui, công việc thuận lợi và luôn tràn đầy cảm hứng sáng tạo! ☕🍀",
    media: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600"
  },
  {
    content: "☕ Khởi đầu ngày mới với nụ cười và năng lượng tích cực nhé bạn của tôi! Chúc ngày mới tốt lành! ☀️",
    media: "https://images.unsplash.com/photo-1426604966848-d7adacbd02bff?w=600"
  }
];

const todayWish = aiDailyWishes[new Date().getDate() % aiDailyWishes.length];

const initialPosts = [
  {
    id: '1',
    author: 'KINI AI',
    avatar: 'AI',
    timestamp: 'Hôm nay',
    content: todayWish.content,
    media: todayWish.media,
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

  // Cập nhật lời chúc của KINI AI tự động mỗi ngày (không trùng lặp)
  useEffect(() => {
    const dayIndex = new Date().getDate() % aiDailyWishes.length;
    const wish = aiDailyWishes[dayIndex];
    setPosts(prev => {
      // Kiểm tra xem bài đăng đầu tiên đã phải là của AI ngày hôm nay chưa
      const first = prev[0];
      if (first && first.author === 'KINI AI' && first.content === wish.content) {
        return prev;
      }
      return [
        {
          id: 'ai_daily_' + Date.now(),
          author: 'KINI AI',
          avatar: 'AI',
          timestamp: 'Hôm nay',
          content: wish.content,
          media: wish.media,
          likes: [],
          comments: []
        },
        ...prev
      ];
    });
  }, []);

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

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

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

  const addPost = (content, mediaUri = null) => {
    if (!content.trim() && !mediaUri) return;
    setPosts([{ id: Date.now().toString(), author: user?.name || 'Bạn', avatar: user?.avatar || 'ME', timestamp: 'Vừa xong', content, media: mediaUri, likes: [], comments: [] }, ...posts]);
  };

  const toggleLikePost = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.includes('me') ? p.likes.filter(id => id !== 'me') : [...p.likes, 'me'] } : p));
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const comment = { id: Date.now().toString(), author: user?.name || 'Bạn', text, timestamp: 'Vừa xong' };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  const addContact = (phone) => {
    if (!phone || phone.trim().length < 8) return { success: false, message: 'Số điện thoại không hợp lệ!' };
    const cleanPhone = phone.trim();
    const existing = contacts.find(c => c.phone === cleanPhone);
    if (existing) return { success: false, message: 'Số điện thoại này đã có trong danh bạ!' };

    const foundName = `Người dùng (${cleanPhone.slice(-4)})`;
    const id = Date.now().toString();
    const newContact = { id, name: foundName, phone: cleanPhone, avatar: foundName.substring(0, 2).toUpperCase(), isOnline: true };
    setContacts(prev => [newContact, ...prev]);

    const newChat = {
      id,
      name: foundName,
      avatar: foundName.substring(0, 2).toUpperCase(),
      isOnline: true,
      unreadCount: 1,
      messages: [{ id: (Date.now()+1).toString(), senderId: id, text: `Xin chào! Tôi dùng số ${cleanPhone}. Rất vui được kết bạn với bạn qua KINI! 👋`, timestamp: 'Vừa xong' }]
    };
    setChats(prev => [newChat, ...prev]);
    return { success: true, name: foundName };
  };

  return (
    <AppContext.Provider value={{ user, chats, contacts, posts, isTyping, login, register, resetPassword, logout, updateUserProfile, sendMessage, clearUnread, addPost, toggleLikePost, addComment, addContact }}>
      {children}
    </AppContext.Provider>
  );
};
