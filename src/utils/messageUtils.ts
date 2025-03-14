
export interface User {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
  attachments?: Attachment[];
  replyToId?: string;
  reactions?: Reaction[];
  isForwarded?: boolean;
  expiresAt?: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size: number;
  thumbnailUrl?: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  name?: string; // for group chats
  isAnonymous?: boolean;
  theme?: string;
}

// Demo data generators
export const generateRandomUser = (id?: string): User => {
  const usernames = [
    "anonymous_hawk", "silent_fox", "pixel_ghost", "quantum_shadow", 
    "hidden_lotus", "cipher_pulse", "secret_raven", "void_whisper",
    "cryptic_echo", "phantom_byte", "mystic_cloak", "stealth_nova",
    "unknown_entity", "masked_nebula", "shadow_drift", "enigma_wave"
  ];
  
  const username = id ? 
    usernames[parseInt(id.replace(/\D/g, '')) % usernames.length] : 
    usernames[Math.floor(Math.random() * usernames.length)];
    
  const statuses: Array<'online' | 'offline' | 'away'> = ['online', 'offline', 'away'];
  
  return {
    id: id || Math.random().toString(36).substring(2, 10),
    username,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastSeen: new Date(Date.now() - Math.random() * 10000000).toISOString()
  };
};

export const generateMockMessage = (senderId: string, receiverId: string): Message => {
  const messageContents = [
    "Hey there!",
    "How's it going?",
    "Did you see the latest update?",
    "I'm thinking of changing my username soon.",
    "Remember, this chat will disappear in 24 hours.",
    "Can we talk about something important?",
    "Check out this new feature I found.",
    "Thoughts on the new security measures?",
    "This app is getting better with each update!",
    "Glad we can chat anonymously here.",
    "What do you think of the group chat option?",
    "Have you tried sharing media files yet?",
    "The HD quality for image sharing is impressive.",
    "I like how we can delete messages for both sides.",
    "Might go anonymous for a while.",
    "The custom themes are a nice touch."
  ];
  
  const content = messageContents[Math.floor(Math.random() * messageContents.length)];
  const timestamp = new Date(Date.now() - Math.random() * 86400000);
  
  // Sometimes add attachments
  const hasAttachment = Math.random() > 0.8;
  let attachments: Attachment[] | undefined = undefined;
  
  if (hasAttachment) {
    const attachmentTypes: Array<'image' | 'video' | 'audio' | 'file'> = ['image', 'video', 'audio', 'file'];
    const type = attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)];
    
    const imageUrls = [
      'https://picsum.photos/800/600',
      'https://picsum.photos/700/500',
      'https://picsum.photos/600/800',
      'https://picsum.photos/500/500',
      'https://picsum.photos/900/600'
    ];
    
    const names = ["photo.jpg", "screenshot.png", "document.pdf", "video.mp4", "voice.mp3"];
    
    attachments = [{
      id: Math.random().toString(36).substring(2, 10),
      type,
      url: type === 'image' ? imageUrls[Math.floor(Math.random() * imageUrls.length)] : '#',
      name: names[Math.floor(Math.random() * names.length)],
      size: Math.floor(Math.random() * 5000000) + 50000, // Random size between 50KB and 5MB
      thumbnailUrl: type === 'video' ? imageUrls[Math.floor(Math.random() * imageUrls.length)] : undefined
    }];
  }
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    content,
    senderId,
    receiverId,
    timestamp,
    status: Math.random() > 0.5 ? 'read' : (Math.random() > 0.5 ? 'delivered' : 'sent'),
    isDeleted: Math.random() > 0.95,
    isForwarded: Math.random() > 0.9,
    attachments,
    reactions: Math.random() > 0.7 ? [{
      userId: receiverId,
      emoji: ['👍', '❤️', '😂', '😮', '🎉', '👏', '🔥'][Math.floor(Math.random() * 7)],
      timestamp: new Date()
    }] : undefined
  };
};

export const generateMockChat = (id: string): Chat => {
  const user = generateRandomUser(id);
  const currentUser = generateRandomUser('current');
  
  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 10) + 1;
  
  for (let i = 0; i < messageCount; i++) {
    if (Math.random() > 0.5) {
      messages.push(generateMockMessage(currentUser.id, user.id));
    } else {
      messages.push(generateMockMessage(user.id, currentUser.id));
    }
  }
  
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return {
    id,
    type: 'direct',
    participants: [currentUser, user],
    lastMessage: messages[messages.length - 1],
    unreadCount: Math.floor(Math.random() * 5),
    createdAt: new Date(Date.now() - Math.random() * 10000000),
    isAnonymous: Math.random() > 0.5
  };
};

export const generateMockChats = (count: number): Chat[] => {
  const chats: Chat[] = [];
  
  for (let i = 0; i < count; i++) {
    chats.push(generateMockChat(`chat_${i}`));
  }
  
  return chats.sort((a, b) => {
    if (!a.lastMessage || !b.lastMessage) return 0;
    return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
  });
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};
