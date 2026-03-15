'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Minus, Send, Bot } from 'lucide-react';
import ChatMessage, { type ChatMessageData } from './ChatMessage';
import QuickQuestions from './QuickQuestions';

// ---------- Helpers ----------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const GREETING_MESSAGE: ChatMessageData = {
  id: 'greeting',
  role: 'assistant',
  content:
    'สวัสดีค่ะ! ดิฉันเป็นผู้ช่วย AI ประจำเทศบาล ยินดีให้บริการค่ะ สามารถสอบถามข้อมูลเกี่ยวกับบริการต่างๆ ของเทศบาลได้เลยค่ะ',
  timestamp: new Date(),
};

// ---------- Component ----------

export default function ChatWidget() {
  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([GREETING_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- Auto-scroll ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // --- Send message ---
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      // Add user message
      const userMessage: ChatMessageData = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setShowQuickQuestions(false);
      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();

        const assistantMessage: ChatMessageData = {
          id: generateId(),
          role: 'assistant',
          content: data.reply ?? data.message ?? 'ขออภัยค่ะ ไม่สามารถตอบกลับได้ในขณะนี้',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessageData = {
          id: generateId(),
          role: 'assistant',
          content: 'ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งค่ะ',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages],
  );

  // --- Handlers ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close on Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // ---------- Render ----------
  return (
    <>
      {/* ===== Chat Window ===== */}
      <div
        ref={chatContainerRef}
        className={`
          fixed z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          bottom-0 right-0 left-0 top-0
          sm:bottom-24 sm:right-6 sm:left-auto sm:top-auto
          sm:w-[400px] sm:rounded-2xl sm:shadow-2xl
        `}
        role="dialog"
        aria-label="ผู้ช่วย AI ประจำเทศบาล"
        aria-modal="true"
        onKeyDown={handleKeyDown}
      >
        <div
          className={`
            bg-white flex flex-col overflow-hidden
            h-full w-full
            sm:h-[500px] sm:rounded-2xl sm:border sm:border-gray-200
            transition-all duration-300
            ${isMinimized ? 'sm:h-[56px]' : ''}
          `}
        >
          {/* ----- Header ----- */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-tight">
                  ผู้ช่วย AI ประจำเทศบาล
                </h2>
                <p className="text-[0.65rem] text-blue-200 leading-tight">
                  {isTyping ? 'กำลังพิมพ์...' : 'ออนไลน์'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Minimize (desktop only) */}
              <button
                type="button"
                onClick={toggleMinimize}
                className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="ย่อแชท"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="ปิดแชท"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ----- Body (hidden when minimized) ----- */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-white"
                role="list"
                aria-label="ประวัติการสนทนา"
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isTyping && (
                  <ChatMessage
                    message={{
                      id: 'typing',
                      role: 'assistant',
                      content: '',
                      timestamp: new Date(),
                    }}
                    isTyping
                  />
                )}

                <div ref={messagesEndRef} aria-hidden="true" />
              </div>

              {/* Quick questions */}
              {showQuickQuestions && messages.length <= 1 && (
                <QuickQuestions onSelect={handleQuickQuestion} />
              )}

              {/* ----- Input ----- */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0"
              >
                <label htmlFor="chat-input" className="sr-only">
                  พิมพ์ข้อความของคุณ
                </label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="พิมพ์ข้อความของคุณ..."
                  disabled={isTyping}
                  autoComplete="off"
                  className="
                    flex-1 px-4 py-2.5
                    text-sm text-gray-800 placeholder-gray-400
                    bg-gray-50 border border-gray-200 rounded-full
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                    disabled:opacity-50
                    transition-shadow
                  "
                  aria-label="พิมพ์ข้อความของคุณ"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="
                    w-10 h-10 flex items-center justify-center
                    bg-blue-600 text-white rounded-full
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                    flex-shrink-0
                  "
                  aria-label="ส่งข้อความ"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ===== Floating Action Button ===== */}
      <button
        type="button"
        onClick={toggleOpen}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-blue-600 text-white
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          hover:bg-blue-700
          focus:outline-none focus:ring-4 focus:ring-blue-300
          transition-all duration-300
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          group
        `}
        aria-label="เปิดแชทกับผู้ช่วย AI"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-6 h-6" />

        {/* Pulse ring */}
        <span
          className="
            absolute inset-0 rounded-full
            bg-blue-400 opacity-0
            group-hover:opacity-0
            animate-ping
          "
          style={{ animationDuration: '2s' }}
          aria-hidden="true"
        />

        {/* Tooltip */}
        <span
          className="
            absolute bottom-full right-0 mb-3
            px-3 py-1.5 text-xs font-medium text-white
            bg-gray-800 rounded-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            whitespace-nowrap pointer-events-none
          "
          aria-hidden="true"
        >
          สอบถาม AI ได้เลยค่ะ
          <span className="absolute top-full right-5 border-4 border-transparent border-t-gray-800" />
        </span>
      </button>
    </>
  );
}
