'use client';

import React from 'react';
import { Bot, User } from 'lucide-react';

// ---------- Types ----------

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
  isTyping?: boolean;
}

// ---------- Markdown-lite renderer ----------

/**
 * Very lightweight inline-markdown support: **bold** and [links](url).
 * No external dependency needed.
 */
function renderContent(text: string): React.ReactNode[] {
  // Split by markdown patterns while preserving groups
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, i) => {
    // Bold
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
    }

    // Link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Plain text — preserve newlines
    return part.split('\n').map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

// ---------- Typing indicator ----------

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1" aria-label="กำลังพิมพ์">
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_0s_infinite]" />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
    </div>
  );
}

// ---------- Loading skeleton ----------

function LoadingSkeleton() {
  return (
    <div className="flex items-start gap-3 animate-pulse" role="status" aria-label="กำลังโหลด">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2 max-w-[75%]">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// ---------- Timestamp ----------

function formatTime(date: Date): string {
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------- Component ----------

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isTyping) {
    return (
      <div className="flex items-start gap-3 mb-4">
        {/* Bot avatar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm"
          aria-hidden="true"
        >
          <Bot className="w-4 h-4 text-white" />
        </div>

        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%]">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      role="listitem"
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-800'
            : 'bg-gradient-to-br from-blue-500 to-blue-700'
        }`}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block px-4 py-3 text-[length:inherit] leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
          }`}
        >
          {renderContent(message.content)}
        </div>

        {/* Timestamp */}
        <p
          className={`text-[0.7rem] mt-1 text-gray-400 ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}
          aria-label={`ส่งเมื่อ ${formatTime(message.timestamp)}`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

ChatMessage.Loading = LoadingSkeleton;
