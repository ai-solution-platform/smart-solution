'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  Eye,
  X,
  Key,
  UserCheck,
  UserX,
  Mail,
  MoreVertical,
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar: string;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ',
  editor: 'บรรณาธิการ',
  viewer: 'ผู้ดู',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  active: 'ใช้งาน',
  inactive: 'ปิดการใช้งาน',
};

const demoUsers: User[] = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.go.th',
    role: 'admin',
    status: 'active',
    lastLogin: '16 มี.ค. 2569 10:30',
    avatar: 'สช',
    createdAt: '1 ม.ค. 2569',
  },
  {
    id: '2',
    name: 'สมหญิง รักดี',
    email: 'somying@example.go.th',
    role: 'editor',
    status: 'active',
    lastLogin: '15 มี.ค. 2569 14:22',
    avatar: 'สญ',
    createdAt: '15 ก.พ. 2569',
  },
  {
    id: '3',
    name: 'วิชัย สุขสม',
    email: 'wichai@example.go.th',
    role: 'editor',
    status: 'active',
    lastLogin: '14 มี.ค. 2569 09:15',
    avatar: 'วช',
    createdAt: '1 มี.ค. 2569',
  },
  {
    id: '4',
    name: 'นภา แสงจันทร์',
    email: 'napa@example.go.th',
    role: 'viewer',
    status: 'active',
    lastLogin: '10 มี.ค. 2569 16:45',
    avatar: 'นภ',
    createdAt: '5 มี.ค. 2569',
  },
  {
    id: '5',
    name: 'ประเสริฐ มั่นคง',
    email: 'prasert@example.go.th',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '1 ก.พ. 2569 11:00',
    avatar: 'ปส',
    createdAt: '10 ม.ค. 2569',
  },
];

const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
];

export default function UsersPage() {
  const [users, setUsers] = useState(demoUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showResetPassword, setShowResetPassword] = useState<string | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const { showToast, ToastContainer } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor' as 'admin' | 'editor' | 'viewer',
    password: '',
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      showToast('กรุณากรอกข้อมูลให้ครบ', 'error');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      lastLogin: 'ยังไม่เคยเข้าสู่ระบบ',
      avatar: formData.name.slice(0, 2),
      createdAt: '16 มี.ค. 2569',
    };
    setUsers((prev) => [...prev, newUser]);
    setFormData({ name: '', email: '', role: 'editor', password: '' });
    setShowForm(false);
    showToast('เพิ่มผู้ใช้สำเร็จ', 'success');
  };

  const handleEditRole = (userId: string, role: 'admin' | 'editor' | 'viewer') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    setEditingUser(null);
    showToast('เปลี่ยนบทบาทสำเร็จ', 'success');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
    setActionMenuId(null);
    showToast('เปลี่ยนสถานะผู้ใช้สำเร็จ', 'success');
  };

  const handleResetPassword = (userId: string) => {
    setShowResetPassword(null);
    showToast('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลผู้ใช้แล้ว', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <Users className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
              <p className="text-sm text-gray-500">เพิ่ม แก้ไข จัดการสิทธิ์ผู้ใช้ระบบ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: '', email: '', role: 'editor', password: '' });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            เพิ่มผู้ใช้ใหม่
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'ผู้ใช้ทั้งหมด', value: users.length, color: 'text-gray-800' },
            { label: 'ผู้ดูแลระบบ', value: users.filter((u) => u.role === 'admin').length, color: 'text-red-600' },
            { label: 'บรรณาธิการ', value: users.filter((u) => u.role === 'editor').length, color: 'text-blue-600' },
            { label: 'ใช้งานอยู่', value: users.filter((u) => u.status === 'active').length, color: 'text-green-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add User Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">เพิ่มผู้ใช้ใหม่</h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.go.th"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, role: e.target.value as 'admin' | 'editor' | 'viewer' }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 bg-white"
                  >
                    <option value="admin">ผู้ดูแลระบบ</option>
                    <option value="editor">บรรณาธิการ</option>
                    <option value="viewer">ผู้ดู</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสผ่านเริ่มต้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    placeholder="รหัสผ่านอย่างน้อย 8 ตัวอักษร"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 py-2.5 text-sm font-medium text-white bg-gov-600 rounded-lg hover:bg-gov-700"
                  >
                    เพิ่มผู้ใช้
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">รีเซ็ตรหัสผ่าน</h3>
                <p className="text-sm text-gray-500 mt-1">
                  ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของผู้ใช้
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleResetPassword(showResetPassword)}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                >
                  ยืนยันรีเซ็ต
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(null)}
                  className="px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาผู้ใช้..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 bg-white"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="admin">ผู้ดูแลระบบ</option>
            <option value="editor">บรรณาธิการ</option>
            <option value="viewer">ผู้ดู</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ผู้ใช้</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">บทบาท</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">เข้าสู่ระบบล่าสุด</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColors[idx % avatarColors.length]}`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {editingUser?.id === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleEditRole(user.id, e.target.value as 'admin' | 'editor' | 'viewer')}
                        onBlur={() => setEditingUser(null)}
                        autoFocus
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-gov-500 bg-white"
                      >
                        <option value="admin">ผู้ดูแลระบบ</option>
                        <option value="editor">บรรณาธิการ</option>
                        <option value="viewer">ผู้ดู</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                      >
                        {user.role === 'admin' ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : user.role === 'editor' ? (
                          <Edit2 className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        {roleLabels[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.status === 'active' ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 relative">
                      <button
                        type="button"
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="แก้ไขบทบาท"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(user.id)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                        title="รีเซ็ตรหัสผ่าน"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-1.5 rounded-lg ${
                          user.status === 'active'
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 'active' ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
