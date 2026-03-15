'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  avatar: string;
}

interface LinkedAccount {
  provider: 'line' | 'google' | 'facebook';
  connected: boolean;
  label: string;
  color: string;
}

export default function CitizenProfilePage() {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifyNews, setNotifyNews] = useState(true);
  const [notifyComplaints, setNotifyComplaints] = useState(true);
  const [notifyDocuments, setNotifyDocuments] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'สมชาย ใจดี',
    phone: '081-234-5678',
    email: 'somchai@gmail.com',
    avatar: '',
  });

  const [editProfile, setEditProfile] = useState<UserProfile>({ ...profile });

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    { provider: 'line', connected: true, label: 'LINE', color: 'bg-[#06C755]' },
    { provider: 'google', connected: false, label: 'Google', color: 'bg-white border border-gray-300' },
    { provider: 'facebook', connected: false, label: 'Facebook', color: 'bg-[#1877F2]' },
  ]);

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...profile });
    setEditing(false);
  };

  const handleToggleAccount = (provider: string) => {
    setLinkedAccounts((prev) =>
      prev.map((acc) =>
        acc.provider === provider ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account');
    setShowDeleteConfirm(false);
  };

  // Mock activities
  const complaints = [
    { id: 1, title: 'ถนนชำรุดซอย 5', status: 'กำลังดำเนินการ', statusColor: 'bg-yellow-100 text-yellow-700', date: '12 มี.ค. 2569' },
    { id: 2, title: 'ไฟทางดับบริเวณตลาด', status: 'เสร็จสิ้น', statusColor: 'bg-green-100 text-green-700', date: '5 มี.ค. 2569' },
    { id: 3, title: 'ขยะตกค้างหน้าวัด', status: 'รับเรื่องแล้ว', statusColor: 'bg-blue-100 text-blue-700', date: '1 มี.ค. 2569' },
  ];

  const documents = [
    { id: 1, title: 'หนังสือรับรองภาษี 2568', date: '10 มี.ค. 2569' },
    { id: 2, title: 'สำเนาทะเบียนพาณิชย์', date: '28 ก.พ. 2569' },
  ];

  const messages = [
    { id: 1, title: 'สอบถามขั้นตอนชำระภาษี', status: 'ตอบแล้ว', date: '8 มี.ค. 2569' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] rounded-2xl p-6 sm:p-8 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-blue-100 text-sm">ยินดีต้อนรับ</p>
              <h1 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h1>
              <p className="text-blue-200 text-sm mt-1">{profile.phone}</p>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">ข้อมูลส่วนตัว</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="py-2 px-4 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors min-h-[44px]"
              >
                แก้ไข
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="py-2 px-4 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors min-h-[44px]"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors min-h-[44px]"
                >
                  บันทึก
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">ชื่อ-นามสกุล</span>
                <span className="text-gray-800 font-medium">{profile.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">เบอร์โทรศัพท์</span>
                <span className="text-gray-800 font-medium">{profile.phone}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">อีเมล</span>
                <span className="text-gray-800 font-medium">{profile.email || '-'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="editName" className="block text-base font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  id="editName"
                  type="text"
                  value={editProfile.fullName}
                  onChange={(e) => setEditProfile((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none min-h-[52px]"
                />
              </div>
              <div>
                <label htmlFor="editPhone" className="block text-base font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="editPhone"
                  type="tel"
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none min-h-[52px]"
                />
              </div>
              <div>
                <label htmlFor="editEmail" className="block text-base font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  id="editEmail"
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none min-h-[52px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Linked Accounts */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">บัญชีที่เชื่อมต่อ</h2>
          <div className="space-y-3">
            {linkedAccounts.map((account) => (
              <div key={account.provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${account.provider === 'google' ? 'text-gray-700' : 'text-white'}`}>{account.label.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{account.label}</p>
                    <p className="text-sm text-gray-400">
                      {account.connected ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAccount(account.provider)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                    account.connected
                      ? 'text-red-500 hover:bg-red-50 border border-red-200'
                      : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                  }`}
                >
                  {account.connected ? 'ยกเลิกเชื่อมต่อ' : 'เชื่อมต่อ'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">กิจกรรมของฉัน</h2>

          {/* Complaints */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              เรื่องร้องเรียนของฉัน
            </h3>
            <div className="space-y-2">
              {complaints.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/complaints" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
              ดูทั้งหมด
            </Link>
          </div>

          {/* Downloaded Documents */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              เอกสารที่ดาวน์โหลด
            </h3>
            <div className="space-y-2">
              {documents.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-800 font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <Link href="/downloads" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
              ดูทั้งหมด
            </Link>
          </div>

          {/* Contact Messages */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              ข้อความติดต่อ
            </h3>
            <div className="space-y-2">
              {messages.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-gray-800 font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700 flex-shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
              ดูทั้งหมด
            </Link>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">การแจ้งเตือน</h2>
          <div className="space-y-4">
            {[
              { label: 'ข่าวสารประชาสัมพันธ์', value: notifyNews, setter: setNotifyNews },
              { label: 'สถานะเรื่องร้องเรียน', value: notifyComplaints, setter: setNotifyComplaints },
              { label: 'เอกสารพร้อมดาวน์โหลด', value: notifyDocuments, setter: setNotifyDocuments },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between p-3 cursor-pointer">
                <span className="text-gray-700 font-medium">{item.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.value}
                  onClick={() => item.setter(!item.value)}
                  className={`w-12 h-7 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                    item.value ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                      item.value ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">ความเป็นส่วนตัว</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 cursor-pointer">
              <div>
                <p className="text-gray-700 font-medium">ยินยอมให้เก็บข้อมูลเพื่อบริการ</p>
                <p className="text-xs text-gray-400">จำเป็นสำหรับการใช้บริการ</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={dataConsent}
                onClick={() => setDataConsent(!dataConsent)}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                  dataConsent ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    dataConsent ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between p-3 cursor-pointer">
              <div>
                <p className="text-gray-700 font-medium">รับข่าวสารการตลาด</p>
                <p className="text-xs text-gray-400">ไม่บังคับ</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={marketingConsent}
                onClick={() => setMarketingConsent(!marketingConsent)}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                  marketingConsent ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    marketingConsent ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          </div>
          <Link href="/privacy-policy" className="inline-block mt-4 text-blue-600 hover:underline text-sm">
            อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม
          </Link>
        </div>

        {/* Logout & Delete */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-lg font-medium transition-colors min-h-[52px]"
          >
            ออกจากระบบ
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 text-red-400 hover:text-red-600 text-sm font-medium transition-colors min-h-[44px]"
          >
            ลบบัญชีของฉัน
          </button>
        </div>

        {/* Back link */}
        <div className="text-center pb-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">ยืนยันการลบบัญชี</h3>
              <p className="text-gray-500 mb-6">
                การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร ไม่สามารถกู้คืนได้
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  ลบบัญชี
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
