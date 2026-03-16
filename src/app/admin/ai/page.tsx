'use client';

import { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  BarChart3,
  FileText,
  Users,
  Settings,
  Zap,
  Globe,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const aiFeatures = [
  {
    icon: MessageSquare,
    title: 'AI Chatbot ประชาชน',
    description: 'จัดการ AI Chatbot ที่ตอบคำถามประชาชนอัตโนมัติ',
    status: 'active',
    stats: '1,245 สนทนา/เดือน',
  },
  {
    icon: FileText,
    title: 'สรุปเนื้อหาอัตโนมัติ',
    description: 'AI สรุปข่าวสารและประกาศโดยอัตโนมัติ',
    status: 'active',
    stats: '89 เนื้อหา',
  },
  {
    icon: BarChart3,
    title: 'วิเคราะห์ข้อร้องเรียน',
    description: 'วิเคราะห์และจัดหมวดหมู่เรื่องร้องเรียนด้วย AI',
    status: 'active',
    stats: '156 รายการวิเคราะห์',
  },
  {
    icon: Users,
    title: 'Citizen Insights',
    description: 'วิเคราะห์พฤติกรรมและความต้องการของประชาชน',
    status: 'beta',
    stats: '3,450 โปรไฟล์',
  },
  {
    icon: Globe,
    title: 'แปลภาษาอัตโนมัติ',
    description: 'แปลเนื้อหาเว็บไซต์เป็นภาษาอังกฤษอัตโนมัติ',
    status: 'beta',
    stats: '45 หน้า',
  },
  {
    icon: TrendingUp,
    title: 'คาดการณ์แนวโน้ม',
    description: 'พยากรณ์แนวโน้มปัญหาและความต้องการของพื้นที่',
    status: 'coming',
    stats: '-',
  },
];

const quickPrompts = [
  'สรุปเรื่องร้องเรียนประจำเดือนนี้',
  'วิเคราะห์ความพึงพอใจประชาชน',
  'แนะนำหัวข้อข่าวสำหรับเดือนหน้า',
  'สรุปสถิติผู้เข้าชมเว็บไซต์',
  'วิเคราะห์คำถามที่พบบ่อยจาก Chatbot',
  'สร้างรายงานสรุปผลงานประจำสัปดาห์',
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'สวัสดีครับ! ผมเป็น AI Assistant ของ Smart Website พร้อมช่วยเหลือคุณ ไม่ว่าจะเป็นการวิเคราะห์ข้อมูล สรุปเนื้อหา หรือจัดการเว็บไซต์ มีอะไรให้ช่วยไหมครับ?',
    timestamp: new Date(),
  },
];

export default function AdminAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'features' | 'settings'>('chat');

  const mockResponses: Record<string, string> = {
    'สรุปเรื่องร้องเรียนประจำเดือนนี้':
      '📊 **สรุปเรื่องร้องเรียน เดือนมีนาคม 2568**\n\n• รวมทั้งหมด: **47 เรื่อง** (เพิ่มขึ้น 12% จากเดือนก่อน)\n• ดำเนินการแล้ว: 38 เรื่อง (80.9%)\n• กำลังดำเนินการ: 7 เรื่อง\n• รอดำเนินการ: 2 เรื่อง\n\n**หมวดหมู่ยอดนิยม:**\n1. ถนนชำรุด/หลุมบ่อ - 15 เรื่อง (31.9%)\n2. ไฟฟ้าสาธารณะ - 12 เรื่อง (25.5%)\n3. ขยะ/ความสะอาด - 8 เรื่อง (17.0%)\n4. ท่อระบายน้ำ - 7 เรื่อง (14.9%)\n5. อื่น ๆ - 5 เรื่อง (10.6%)\n\n**พื้นที่ที่มีเรื่องร้องเรียนมากที่สุด:** หมู่ 3 (12 เรื่อง)',
    'วิเคราะห์ความพึงพอใจประชาชน':
      '📈 **ผลวิเคราะห์ความพึงพอใจประชาชน Q1/2568**\n\n**คะแนนเฉลี่ยรวม: 4.2/5.0** ⭐\n\n• ความรวดเร็วในการให้บริการ: 4.0/5.0\n• ความสุภาพของเจ้าหน้าที่: 4.5/5.0\n• ความสะดวกของช่องทางบริการ: 4.3/5.0\n• คุณภาพของการแก้ปัญหา: 3.9/5.0\n• ความโปร่งใสในการดำเนินงาน: 4.1/5.0\n\n**ข้อเสนอแนะหลัก:**\n1. เพิ่มช่องทางออนไลน์สำหรับบริการมากขึ้น\n2. ลดระยะเวลารอคิวในช่วงเช้า\n3. ปรับปรุงป้ายบอกทางภายในสำนักงาน',
    'แนะนำหัวข้อข่าวสำหรับเดือนหน้า':
      '📝 **หัวข้อข่าวแนะนำ เดือนเมษายน 2568**\n\n1. **กิจกรรมวันสงกรานต์** - รดน้ำดำหัวผู้สูงอายุ\n2. **ประกาศชำระภาษีที่ดิน** - แจ้งเตือนกำหนดชำระ\n3. **โครงการปรับปรุงถนน** - ความคืบหน้าโครงการ\n4. **รณรงค์ป้องกันไข้เลือดออก** - ฤดูฝนใกล้มา\n5. **กิจกรรมกีฬาชุมชน** - ส่งเสริมสุขภาพ\n6. **เปิดรับสมัครเรียน ศพด.** - ปีการศึกษา 2568',
    default:
      'ขอบคุณสำหรับคำถามครับ! ผมได้วิเคราะห์ข้อมูลแล้ว นี่เป็นระบบ Demo ในเวอร์ชันเต็ม AI จะประมวลผลข้อมูลจริงจากฐานข้อมูลของเทศบาล รวมถึงข่าว ร้องเรียน สถิติผู้เข้าชม และข้อมูล CDP เพื่อให้คำตอบที่แม่นยำครับ',
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = mockResponses[query] || mockResponses['default'];
    const assistantMessage: ChatMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            AI Assistant
          </h1>
          <p className="text-gray-500 mt-1">ผู้ช่วย AI อัจฉริยะสำหรับการจัดการเว็บไซต์เทศบาล</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'chat' as const, label: 'สนทนากับ AI', icon: MessageSquare },
          { id: 'features' as const, label: 'ฟีเจอร์ AI', icon: Sparkles },
          { id: 'settings' as const, label: 'ตั้งค่า', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ height: '600px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="พิมพ์คำถามหรือคำสั่ง..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                คำสั่งด่วน
              </h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left text-sm px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Stats */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                สถิติ AI เดือนนี้
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">สนทนาทั้งหมด</span>
                  <span className="font-bold">1,245</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">ตอบถูกต้อง</span>
                  <span className="font-bold">92.4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">เวลาตอบเฉลี่ย</span>
                  <span className="font-bold">2.3 วินาที</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">ความพึงพอใจ</span>
                  <span className="font-bold">4.6/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      feature.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : feature.status === 'beta'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {feature.status === 'active' ? 'ใช้งานอยู่' : feature.status === 'beta' ? 'Beta' : 'เร็ว ๆ นี้'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {feature.stats}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              ตั้งค่า AI Chatbot
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความต้อนรับ</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  defaultValue="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ? สอบถามข้อมูลเทศบาลได้เลยค่ะ 😊"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ภาษาหลัก</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm">
                  <option>ภาษาไทย</option>
                  <option>English</option>
                  <option>ไทย + English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">โทนการสนทนา</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm">
                  <option>เป็นทางการ (ภาษาราชการ)</option>
                  <option>กึ่งทางการ (สุภาพ เข้าถึงง่าย)</option>
                  <option>เป็นกันเอง (ภาษาพูด)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">เปิดใช้งาน Chatbot</p>
                  <p className="text-xs text-gray-500">แสดง Chatbot บนเว็บไซต์สาธารณะ</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">ส่งต่อเจ้าหน้าที่</p>
                  <p className="text-xs text-gray-500">เมื่อ AI ไม่สามารถตอบได้ ส่งต่อไปยังเจ้าหน้าที่</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              ฐานความรู้ AI
            </h3>
            <div className="space-y-3">
              {[
                { name: 'ข้อมูลทั่วไปเทศบาล', docs: 12, updated: '2 วันที่แล้ว', status: 'synced' },
                { name: 'คู่มือบริการประชาชน', docs: 8, updated: '1 สัปดาห์ที่แล้ว', status: 'synced' },
                { name: 'ข้อมูลจัดซื้อจัดจ้าง', docs: 24, updated: '3 วันที่แล้ว', status: 'synced' },
                { name: 'กฎหมายท้องถิ่น', docs: 6, updated: '2 สัปดาห์ที่แล้ว', status: 'needs-update' },
              ].map((kb, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{kb.name}</p>
                      <p className="text-xs text-gray-400">{kb.docs} เอกสาร | อัพเดท {kb.updated}</p>
                    </div>
                  </div>
                  {kb.status === 'synced' ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      ซิงค์แล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      ต้องอัพเดท
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
