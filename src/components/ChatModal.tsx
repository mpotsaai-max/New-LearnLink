import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, ShieldCheck, PhoneCall, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const ChatModal: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeChatUser, setActiveChatUser, chats, messages, sendMessage, getOrCreateChat, markChatAsRead } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeChatUser || !currentUser) return null;

  const isStudent = currentUser.role === 'student';
  const studentId = isStudent ? currentUser.id : activeChatUser.id;
  const tutorId = isStudent ? activeChatUser.id : currentUser.id;
  const studentName = isStudent ? currentUser.fullName : activeChatUser.name;
  const tutorName = isStudent ? activeChatUser.name : currentUser.fullName;

  const chat = getOrCreateChat(studentId, tutorId, studentName, tutorName, currentUser.avatarUrl, activeChatUser.avatar);
  const chatMessages = messages.filter(m => m.chatId === chat.id);

  useEffect(() => {
    markChatAsRead(chat.id);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, chat.id, markChatAsRead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    sendMessage(chat.id, activeChatUser.id, inputMsg.trim());
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="p-4 bg-[#022448] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={activeChatUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt={activeChatUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#feae2c]"
            />
            <div>
              <h3 className="font-bold text-sm text-white">{activeChatUser.name}</h3>
              <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active on LearnLink Direct Chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveChatUser(null)}
              className="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Encrypted Direct Messaging. Never share personal bank details outside LearnLink Escrow.</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No messages yet. Send a greeting to start your conversation!
            </div>
          ) : (
            chatMessages.map(m => {
              const isMine = m.senderId === currentUser.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-baseline gap-1.5 mb-0.5 px-1">
                    <span className="text-[10px] font-bold text-slate-500">{m.senderName}</span>
                    <span className="text-[9px] text-slate-400">{m.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? 'bg-[#022448] text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap text-slate-600">
          <button
            onClick={() => setInputMsg('Dumela! Are you available this weekend for a 1.5hr session?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full"
          >
            👋 Ask about weekend availability
          </button>
          <button
            onClick={() => setInputMsg('Could you please share the past paper topic list?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full"
          >
            📚 Request topic list
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#022448] outline-none"
          />
          <button
            type="submit"
            className="p-3 bg-[#feae2c] text-[#022448] font-bold rounded-2xl hover:bg-[#f09c13] transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
