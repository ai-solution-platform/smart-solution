'use client';

import { useState } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  Save,
  Eye,
  X,
  Globe,
  ExternalLink,
  Navigation,
  PanelBottom,
  PanelLeft,
} from 'lucide-react';
import MenuBuilder, { MenuItem } from '@/components/admin/MenuBuilder';
import { useToast } from '@/components/admin/Toast';

const demoMenuItems: MenuItem[] = [
  {
    id: '1',
    labelTh: 'หน้าหลัก',
    labelEn: 'Home',
    url: '/',
    target: '_self',
    children: [],
    isExpanded: true,
  },
  {
    id: '2',
    labelTh: 'เกี่ยวกับเรา',
    labelEn: 'About Us',
    url: '/about',
    target: '_self',
    isExpanded: true,
    children: [
      {
        id: '2-1',
        labelTh: 'ประวัติความเป็นมา',
        labelEn: 'History',
        url: '/about/history',
        target: '_self',
        children: [],
      },
      {
        id: '2-2',
        labelTh: 'โครงสร้างองค์กร',
        labelEn: 'Organization Structure',
        url: '/about/structure',
        target: '_self',
        children: [],
      },
      {
        id: '2-3',
        labelTh: 'คณะผู้บริหาร',
        labelEn: 'Executives',
        url: '/about/executives',
        target: '_self',
        children: [],
      },
    ],
  },
  {
    id: '3',
    labelTh: 'ข่าวสาร',
    labelEn: 'News',
    url: '/news',
    target: '_self',
    isExpanded: true,
    children: [
      {
        id: '3-1',
        labelTh: 'ข่าวประชาสัมพันธ์',
        labelEn: 'Announcements',
        url: '/news/announcements',
        target: '_self',
        children: [],
      },
      {
        id: '3-2',
        labelTh: 'ข่าวจัดซื้อจัดจ้าง',
        labelEn: 'Procurement',
        url: '/news/procurement',
        target: '_self',
        children: [],
      },
    ],
  },
  {
    id: '4',
    labelTh: 'บริการประชาชน',
    labelEn: 'Services',
    url: '/services',
    target: '_self',
    children: [],
  },
  {
    id: '5',
    labelTh: 'ติดต่อเรา',
    labelEn: 'Contact',
    url: '/contact',
    target: '_self',
    children: [],
  },
];

const menuPositions = [
  { id: 'main', label: 'เมนูหลัก (Main Navigation)', icon: Navigation },
  { id: 'footer', label: 'เมนูส่วนท้าย (Footer)', icon: PanelBottom },
  { id: 'sidebar', label: 'เมนูด้านข้าง (Sidebar)', icon: PanelLeft },
];

const defaultNewItem: Omit<MenuItem, 'id'> = {
  labelTh: '',
  labelEn: '',
  url: '',
  icon: '',
  target: '_self',
  children: [],
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenuItems);
  const [activePosition, setActivePosition] = useState('main');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(defaultNewItem);
  const [showPreview, setShowPreview] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleAdd = () => {
    if (!formData.labelTh.trim()) {
      showToast('กรุณาระบุชื่อเมนู (ภาษาไทย)', 'error');
      return;
    }
    const newItem: MenuItem = {
      ...formData,
      id: Date.now().toString(),
    };
    setMenuItems((prev) => [...prev, newItem]);
    setFormData(defaultNewItem);
    setShowAddForm(false);
    showToast('เพิ่มเมนูสำเร็จ', 'success');
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      labelTh: item.labelTh,
      labelEn: item.labelEn,
      url: item.url,
      icon: item.icon || '',
      target: item.target,
      children: item.children,
    });
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    if (!editingItem) return;
    const updateItems = (items: MenuItem[]): MenuItem[] =>
      items.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : { ...item, children: updateItems(item.children) }
      );
    setMenuItems(updateItems(menuItems));
    setEditingItem(null);
    setFormData(defaultNewItem);
    setShowAddForm(false);
    showToast('แก้ไขเมนูสำเร็จ', 'success');
  };

  const handleDelete = (id: string) => {
    const removeItem = (items: MenuItem[]): MenuItem[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => ({ ...item, children: removeItem(item.children) }));
    setMenuItems(removeItem(menuItems));
    showToast('ลบเมนูสำเร็จ', 'success');
  };

  const handleSave = () => {
    showToast('บันทึกโครงสร้างเมนูสำเร็จ', 'success');
  };

  const renderPreviewMenu = (items: MenuItem[], depth = 0) => (
    <ul className={depth === 0 ? 'space-y-0.5' : 'ml-4 mt-1 space-y-0.5'}>
      {items.map((item) => (
        <li key={item.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              depth === 0
                ? 'bg-gov-600 text-white font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{item.labelTh}</span>
            {item.target === '_blank' && <ExternalLink className="w-3 h-3 opacity-50" />}
          </div>
          {item.children.length > 0 && renderPreviewMenu(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <MenuIcon className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">จัดการเมนูและผังเว็บไซต์</h1>
              <p className="text-sm text-gray-500">จัดเรียง เพิ่ม แก้ไขรายการเมนูของเว็บไซต์</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 font-medium"
            >
              <Save className="w-4 h-4" />
              บันทึกเมนู
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Menu Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Menu Position Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ตำแหน่งเมนู</h3>
              <div className="flex gap-2">
                {menuPositions.map((pos) => {
                  const Icon = pos.icon;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setActivePosition(pos.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                        activePosition === pos.id
                          ? 'bg-gov-600 text-white font-medium shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {pos.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  รายการเมนู ({menuItems.length} รายการ)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setFormData(defaultNewItem);
                    setShowAddForm(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gov-600 bg-gov-50 rounded-lg hover:bg-gov-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่มเมนู
                </button>
              </div>

              <MenuBuilder
                items={menuItems}
                onChange={setMenuItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Right: Add/Edit Form + Preview */}
          <div className="space-y-6">
            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setFormData(defaultNewItem);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเมนู (ภาษาไทย) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.labelTh}
                      onChange={(e) => setFormData((p) => ({ ...p, labelTh: e.target.value }))}
                      placeholder="เช่น หน้าหลัก"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเมนู (ภาษาอังกฤษ)
                    </label>
                    <input
                      type="text"
                      value={formData.labelEn}
                      onChange={(e) => setFormData((p) => ({ ...p, labelEn: e.target.value }))}
                      placeholder="e.g. Home"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                      placeholder="/about"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ไอคอน</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                      placeholder="เช่น home, info, phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เปิดลิงก์
                    </label>
                    <select
                      value={formData.target}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, target: e.target.value as '_self' | '_blank' }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 bg-white"
                    >
                      <option value="_self">หน้าเดิม (Same tab)</option>
                      <option value="_blank">แท็บใหม่ (New tab)</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={editingItem ? handleUpdate : handleAdd}
                      className="flex-1 py-2.5 text-sm font-medium text-white bg-gov-600 rounded-lg hover:bg-gov-700"
                    >
                      {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                        setFormData(defaultNewItem);
                      }}
                      className="px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    ตัวอย่างโครงสร้างเมนู
                  </h3>
                </div>
                <div className="p-4">{renderPreviewMenu(menuItems)}</div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">คำแนะนำ</h4>
              <ul className="space-y-1.5 text-xs text-blue-700">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5">&#8226;</span>
                  ใช้ปุ่มลูกศรเพื่อเลื่อนลำดับเมนูขึ้น/ลง
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5">&#8226;</span>
                  ใช้ปุ่มลูกศรซ้าย/ขวาเพื่อเพิ่ม/ลดระดับ (สร้างเมนูย่อย)
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5">&#8226;</span>
                  คลิกไอคอนดินสอเพื่อแก้ไขรายละเอียด
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5">&#8226;</span>
                  อย่าลืมกด &quot;บันทึกเมนู&quot; เมื่อแก้ไขเสร็จ
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
