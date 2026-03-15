'use client';

import { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Phone,
  Share2,
  Search as SearchIcon,
  Shield,
  Database,
  Key,
  MapPin,
  Mail,
  Facebook,
  Youtube,
  MessageCircle,
  Music2,
  ToggleLeft,
  ToggleRight,
  Download,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isVisible: boolean;
}

export default function SettingsPage() {
  const { showToast, ToastContainer } = useToast();

  // General
  const [siteName, setSiteName] = useState('องค์การบริหารส่วนตำบลตัวอย่าง');
  const [siteDescription, setSiteDescription] = useState(
    'เว็บไซต์ทางการขององค์การบริหารส่วนตำบลตัวอย่าง จังหวัดตัวอย่าง'
  );
  const [siteKeywords, setSiteKeywords] = useState(
    'อบต, องค์การบริหารส่วนตำบล, ราชการ, บริการประชาชน'
  );

  // Contact
  const [address, setAddress] = useState(
    '123 หมู่ 4 ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง 10000'
  );
  const [phone, setPhone] = useState('02-xxx-xxxx');
  const [fax, setFax] = useState('02-xxx-xxxx');
  const [email, setEmail] = useState('contact@example.go.th');
  const [mapLat, setMapLat] = useState('13.7563');
  const [mapLng, setMapLng] = useState('100.5018');

  // Social
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/example-obt');
  const [lineId, setLineId] = useState('@example-obt');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState('องค์การบริหารส่วนตำบลตัวอย่าง');
  const [metaDescription, setMetaDescription] = useState(
    'เว็บไซต์ทางการขององค์การบริหารส่วนตำบลตัวอย่าง ให้บริการข้อมูลข่าวสาร ประชาสัมพันธ์'
  );
  const [gaId, setGaId] = useState('G-XXXXXXXXXX');

  // Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Google Maps API', key: 'AIzaSyB...xxxxx', isVisible: false },
    { id: '2', name: 'AI Chatbot API', key: 'sk-ant-...xxxxx', isVisible: false },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'ทั่วไป', icon: Globe },
    { id: 'contact', label: 'ข้อมูลติดต่อ', icon: Phone },
    { id: 'social', label: 'โซเชียลมีเดีย', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'maintenance', label: 'ระบบ', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  const handleSave = () => {
    showToast('บันทึกการตั้งค่าสำเร็จ', 'success');
  };

  const handleBackup = () => {
    showToast('เริ่มสำรองข้อมูล... (จำลอง)', 'info');
  };

  const addApiKey = () => {
    if (!newKeyName || !newKeyValue) {
      showToast('กรุณากรอกชื่อและคีย์', 'error');
      return;
    }
    setApiKeys((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newKeyName, key: newKeyValue, isVisible: false },
    ]);
    setNewKeyName('');
    setNewKeyValue('');
    showToast('เพิ่ม API Key สำเร็จ', 'success');
  };

  const removeApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast('ลบ API Key สำเร็จ', 'success');
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, isVisible: !k.isVisible } : k))
    );
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <Settings className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
              <p className="text-sm text-gray-500">กำหนดค่าทั่วไป ข้อมูลติดต่อ SEO และระบบ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 font-medium"
          >
            <Save className="w-4 h-4" />
            บันทึกทั้งหมด
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-52 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sticky top-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gov-50 text-gov-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* General */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gov-600" />
                  ข้อมูลทั่วไป
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      ชื่อเว็บไซต์
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      คำอธิบายเว็บไซต์
                    </label>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      คำค้นหา (Keywords)
                    </label>
                    <input
                      type="text"
                      value={siteKeywords}
                      onChange={(e) => setSiteKeywords(e.target.value)}
                      className={inputClass}
                      placeholder="คั่นด้วยเครื่องหมายจุลภาค"
                    />
                    <p className="text-xs text-gray-400 mt-1">คั่นแต่ละคำด้วยเครื่องหมายจุลภาค (,)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gov-600" />
                  ข้อมูลติดต่อ
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      ที่อยู่
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        โทรศัพท์
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        แฟกซ์
                      </label>
                      <input
                        type="text"
                        value={fax}
                        onChange={(e) => setFax(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Mail className="w-3.5 h-3.5 inline mr-1" />
                      อีเมล
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      พิกัดแผนที่
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                        <input
                          type="text"
                          value={mapLat}
                          onChange={(e) => setMapLat(e.target.value)}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                        <input
                          type="text"
                          value={mapLng}
                          onChange={(e) => setMapLng(e.target.value)}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                    </div>
                    {/* Map placeholder */}
                    <div className="mt-3 h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <MapPin className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">แผนที่ตัวอย่าง ({mapLat}, {mapLng})</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-gov-600" />
                  โซเชียลมีเดีย
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      className={inputClass}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      LINE ID
                    </label>
                    <input
                      type="text"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className={inputClass}
                      placeholder="@example"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Youtube className="w-4 h-4 text-red-600" />
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className={inputClass}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Music2 className="w-4 h-4" />
                      TikTok URL
                    </label>
                    <input
                      type="url"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      className={inputClass}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SEO */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-gov-600" />
                  SEO และการวิเคราะห์
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Meta Title เริ่มต้น
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      แนะนำไม่เกิน 60 ตัวอักษร ({metaTitle.length}/60)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Meta Description เริ่มต้น
                    </label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      แนะนำไม่เกิน 160 ตัวอักษร ({metaDescription.length}/160)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      className={`${inputClass} font-mono`}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  {/* SEO Preview */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-3">ตัวอย่างผลการค้นหา Google</p>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-lg text-blue-700 hover:underline cursor-pointer">
                        {metaTitle || 'ชื่อเว็บไซต์'}
                      </p>
                      <p className="text-sm text-green-700 mt-0.5">
                        www.example.go.th
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {metaDescription || 'คำอธิบายเว็บไซต์จะแสดงที่นี่...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance & System */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                {/* Maintenance Mode */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gov-600" />
                    โหมดปิดปรับปรุง
                  </h2>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700">โหมดปิดปรับปรุงระบบ</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        เมื่อเปิด ผู้เยี่ยมชมจะเห็นหน้า &quot;กำลังปรับปรุง&quot; แทนเว็บไซต์จริง
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        showToast(
                          maintenanceMode ? 'ปิดโหมดปรับปรุงแล้ว' : 'เปิดโหมดปรับปรุงแล้ว',
                          maintenanceMode ? 'success' : 'warning'
                        );
                      }}
                      className="flex-shrink-0"
                    >
                      {maintenanceMode ? (
                        <ToggleRight className="w-10 h-10 text-orange-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-gray-300" />
                      )}
                    </button>
                  </div>
                  {maintenanceMode && (
                    <div className="mt-3 flex items-center gap-2 text-orange-600 text-xs bg-orange-50 px-3 py-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>เว็บไซต์อยู่ในโหมดปรับปรุง ผู้เยี่ยมชมจะไม่สามารถเข้าถึงเว็บไซต์ได้</span>
                    </div>
                  )}
                </div>

                {/* Backup */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <Database className="w-5 h-5 text-gov-600" />
                    สำรองข้อมูล
                  </h2>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700">สำรองข้อมูลทั้งระบบ</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        สำรองข้อมูลเว็บไซต์ รูปภาพ และฐานข้อมูลทั้งหมด
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        สำรองล่าสุด: 14 มี.ค. 2569 22:00 น.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBackup}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gov-600 bg-white border border-gov-300 rounded-lg hover:bg-gov-50"
                    >
                      <Download className="w-4 h-4" />
                      สำรองข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Key className="w-5 h-5 text-gov-600" />
                  จัดการ API Keys
                </h2>

                {/* Existing Keys */}
                <div className="space-y-3 mb-6">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">{apiKey.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-gray-500 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                            {apiKey.isVisible ? apiKey.key : '••••••••••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            {apiKey.isVisible ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeApiKey(apiKey.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Key */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">เพิ่ม API Key ใหม่</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ชื่อ API</label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className={inputClass}
                        placeholder="เช่น Google Maps API, OpenAI API"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">API Key</label>
                      <input
                        type="text"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        className={`${inputClass} font-mono`}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addApiKey}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gov-600 rounded-lg hover:bg-gov-700"
                    >
                      <Plus className="w-4 h-4" />
                      เพิ่ม API Key
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
