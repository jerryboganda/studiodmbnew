import React, { useState } from 'react';
import { 
  Search, Phone, Video, MoreVertical, Mic, Image, Smile, Send, 
  CheckCheck, Clock, ShieldAlert, Sparkles, FileText, Lock, Eye, EyeOff,
  ChevronLeft, Plus, Users, Calendar
} from 'lucide-react';
import { MOCK_CHATS, CURRENT_USER } from '../constants';
import { Chat, Message } from '../types';
import CallModal from './CallModal';

const MessagesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'primary' | 'requests'>('primary');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(MOCK_CHATS[0].id);
  const [inputText, setInputText] = useState('');
  const [showCallModal, setShowCallModal] = useState<'video' | 'audio' | null>(null);
  
  // Simulated local messages state for demo
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
        { id: '1', senderId: '1', text: "Hi Dr. Kumar, I reviewed your profile. Impressive work on the cardio research!", type: 'text', timestamp: '10:30 AM', status: 'read' },
        { id: '2', senderId: 'me', text: "Thank you Dr. Aditi! I'm glad you found it interesting. I see you're also into hiking?", type: 'text', timestamp: '10:35 AM', status: 'read' },
        { id: '3', senderId: '1', text: "Yes! I go to the Himalayas once a year. Would love to chat more about it.", type: 'text', timestamp: '10:36 AM', status: 'read' },
        { id: '4', senderId: 'me', text: "That sounds wonderful. Are you free for a quick call this weekend?", type: 'text', timestamp: '10:40 AM', status: 'read' },
        { id: '5', senderId: '1', text: "That sounds perfect! Saturday works for me.", type: 'text', timestamp: '10:42 AM', status: 'read' },
        { id: '6', senderId: 'system', text: "Dealbreaker Check: Dr. Aditi has verified 'Vegetarian' diet.", type: 'prompt', timestamp: '10:43 AM', status: 'read' }
    ],
    '2': [
        { id: '1', senderId: '2', text: "Namaste beta, we liked your profile.", type: 'text', timestamp: 'Yesterday', status: 'read' },
        { id: '2', senderId: 'me', text: "Namaste Aunty ji.", type: 'text', timestamp: 'Yesterday', status: 'read' },
        { id: '3', senderId: '2', text: "Shared a family photo album", type: 'text', isSensitive: true, mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', timestamp: 'Yesterday', status: 'read' }
    ]
  });

  const selectedChat = MOCK_CHATS.find(c => c.id === selectedChatId);
  const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];
  
  const displayedChats = MOCK_CHATS.filter(c => 
    activeTab === 'requests' ? c.isRequest : !c.isRequest
  );

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChatId) return;
    const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        text: inputText,
        type: 'text',
        timestamp: 'Just now',
        status: 'sent'
    };
    setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    setInputText('');
  };

  return (
    <div className="flex h-full bg-white relative">
      {/* Left Sidebar: Chat List */}
      <div className="w-80 flex flex-col border-r border-slate-200">
        
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('primary')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'primary' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                Primary
            </button>
            <button 
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'requests' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                Requests
                <span className="bg-primary text-white text-[9px] px-1.5 rounded-full">1</span>
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
            {displayedChats.map(chat => (
                <div 
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 ${selectedChatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                >
                    <div className="relative">
                        <div className="size-12 rounded-full bg-slate-200 overflow-hidden">
                             {chat.type === 'group' ? (
                                 <div className="grid grid-cols-2 h-full">
                                     <img src={chat.participants[0].avatarUrl} className="w-full h-full object-cover" />
                                     <img src={chat.participants[1].avatarUrl} className="w-full h-full object-cover" />
                                 </div>
                             ) : (
                                 <img src={chat.participants[0].avatarUrl} className="w-full h-full object-cover" />
                             )}
                        </div>
                        {chat.isOnline && <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-slate-900 truncate">
                                {chat.type === 'group' ? 'Family Group' : chat.participants[0].name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">{chat.lastMessage.timestamp}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                            {chat.lastMessage.senderId === 'me' && 'You: '}
                            {chat.lastMessage.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Right Area: Chat Window */}
      {selectedChat ? (
          <div className="flex-1 flex flex-col h-full bg-[#f0f2f5]">
              {/* Header */}
              <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200 overflow-hidden">
                             <img src={selectedChat.participants[0].avatarUrl} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                {selectedChat.participants[0].name}
                                {selectedChat.type === 'matchmaker' && <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Agent</span>}
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                {selectedChat.isOnline ? <span className="text-green-600 font-bold">Online</span> : 'Last seen recently'}
                            </p>
                        </div>
                  </div>
                  <div className="flex items-center gap-1">
                      <button onClick={() => setShowCallModal('audio')} className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors">
                          <Phone size={20} />
                      </button>
                      <button onClick={() => setShowCallModal('video')} className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors">
                          <Video size={20} />
                      </button>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors" title="Report/Block">
                          <ShieldAlert size={20} />
                      </button>
                  </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Encryption Notice */}
                  <div className="flex justify-center mb-6">
                      <div className="bg-yellow-50 text-yellow-800 text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-yellow-100">
                          <Lock size={10} /> Messages are end-to-end encrypted.
                      </div>
                  </div>

                  {currentMessages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                  ))}
              </div>

              {/* Input Area */}
              <div className="bg-white p-4 border-t border-slate-200">
                  {/* Conversation Tools Strip */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                      <ToolPill icon={<Sparkles size={12} />} label="Icebreaker" />
                      <ToolPill icon={<CheckCheck size={12} />} label="Dealbreaker Check" />
                      <ToolPill icon={<Calendar size={12} />} label="Schedule Call" />
                      <ToolPill icon={<FileText size={12} />} label="Share Biodata" />
                  </div>

                  <div className="flex items-end gap-2 bg-slate-100 rounded-2xl p-2">
                      <button className="p-2 text-slate-500 hover:text-primary hover:bg-white rounded-full transition-colors">
                          <Plus size={20} />
                      </button>
                      <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 text-sm text-slate-900"
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      ></textarea>
                      {inputText ? (
                          <button onClick={handleSendMessage} className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover shadow-sm transition-all">
                              <Send size={18} />
                          </button>
                      ) : (
                          <>
                            <button className="p-2 text-slate-500 hover:text-primary hover:bg-white rounded-full transition-colors">
                                <Image size={20} />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-primary hover:bg-white rounded-full transition-colors">
                                <Mic size={20} />
                            </button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Users size={32} />
              </div>
              <p className="font-bold">Select a conversation</p>
          </div>
      )}

      {/* Call Modal */}
      {showCallModal && selectedChat && (
          <CallModal 
            type={showCallModal} 
            participantName={selectedChat.participants[0].name}
            participantImage={selectedChat.participants[0].avatarUrl}
            onEndCall={() => setShowCallModal(null)} 
          />
      )}
    </div>
  );
};

const ToolPill: React.FC<{icon: React.ReactNode, label: string}> = ({ icon, label }) => (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap">
        {icon} {label}
    </button>
);

const MessageBubble: React.FC<{message: Message}> = ({ message }) => {
    const isMe = message.senderId === 'me';
    const isSystem = message.senderId === 'system';
    const [revealed, setRevealed] = useState(false);

    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <div className="bg-slate-200/50 text-slate-600 text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-slate-200">
                    <Sparkles size={12} className="text-primary" />
                    {message.text}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isMe ? 'bg-primary text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white text-slate-900 rounded-r-2xl rounded-tl-2xl shadow-sm'} px-4 py-3 relative group`}>
                
                {/* Content */}
                {message.isSensitive && !revealed ? (
                    <div className="w-60 h-40 bg-slate-100 rounded-lg flex flex-col items-center justify-center gap-2 border border-slate-200 overflow-hidden relative cursor-pointer" onClick={() => setRevealed(true)}>
                         <div className="absolute inset-0 bg-cover bg-center blur-lg opacity-50" style={{backgroundImage: `url(${message.mediaUrl})`}}></div>
                         <div className="z-10 bg-white/90 p-2 rounded-full shadow-sm">
                             <EyeOff size={20} className="text-slate-500" />
                         </div>
                         <span className="z-10 text-xs font-bold text-slate-700">Sensitive Content</span>
                         <span className="z-10 text-[10px] text-slate-500">Tap to view</span>
                    </div>
                ) : message.mediaUrl ? (
                     <img src={message.mediaUrl} className="w-60 rounded-lg mb-2" />
                ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                )}

                {/* Metadata */}
                <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-white/70 justify-end' : 'text-slate-400'}`}>
                    {message.timestamp}
                    {isMe && (
                        <span>
                            {message.status === 'read' ? <CheckCheck size={12} /> : <CheckCheck size={12} className="opacity-50" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesView;