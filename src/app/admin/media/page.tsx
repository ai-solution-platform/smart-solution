'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  FolderPlus,
  Trash2,
  Edit2,
  Download,
  Eye,
  Image as ImageIcon,
  FileText,
  Film,
  File,
  X,
  Check,
  FolderOpen,
  ChevronRight,
  MoreVertical,
  Copy,
  Filter,
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: string;
  dimensions?: string;
  url: string;
  thumbnail: string;
  folder: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
}

const demoFolders: Folder[] = [
  { id: 'all', name: 'ทั้งหมด', count: 24 },
  { id: 'banners', name: 'แบนเนอร์', count: 6 },
  { id: 'news', name: 'ข่าวสาร', count: 8 },
  { id: 'activities', name: 'กิจกรรม', count: 5 },
  { id: 'documents', name: 'เอกสาร', count: 3 },
  { id: 'logos', name: 'โลโก้', count: 2 },
];

const demoFiles: MediaFile[] = [
  {
    id: '1',
    name: 'banner-main.jpg',
    type: 'image',
    size: '2.4 MB',
    dimensions: '1920x600',
    url: '/uploads/banner-main.jpg',
    thumbnail: '',
    folder: 'banners',
    uploadedAt: '15 มี.ค. 2569',
    uploadedBy: 'สมชาย ใจดี',
  },
  {
    id: '2',
    name: 'news-meeting-2025.jpg',
    type: 'image',
    size: '1.8 MB',
    dimensions: '1200x800',
    url: '/uploads/news-meeting.jpg',
    thumbnail: '',
    folder: 'news',
    uploadedAt: '14 มี.ค. 2569',
    uploadedBy: 'สมหญิง รักดี',
  },
  {
    id: '3',
    name: 'ประกาศ-สอบราคา.pdf',
    type: 'document',
    size: '540 KB',
    url: '/uploads/announce.pdf',
    thumbnail: '',
    folder: 'documents',
    uploadedAt: '13 มี.ค. 2569',
    uploadedBy: 'สมชาย ใจดี',
  },
  {
    id: '4',
    name: 'กิจกรรม-วันเด็ก.jpg',
    type: 'image',
    size: '3.1 MB',
    dimensions: '1600x1200',
    url: '/uploads/childrens-day.jpg',
    thumbnail: '',
    folder: 'activities',
    uploadedAt: '12 มี.ค. 2569',
    uploadedBy: 'สมหญิง รักดี',
  },
  {
    id: '5',
    name: 'logo-obt.png',
    type: 'image',
    size: '180 KB',
    dimensions: '400x400',
    url: '/uploads/logo-obt.png',
    thumbnail: '',
    folder: 'logos',
    uploadedAt: '10 มี.ค. 2569',
    uploadedBy: 'สมชาย ใจดี',
  },
  {
    id: '6',
    name: 'banner-services.jpg',
    type: 'image',
    size: '1.9 MB',
    dimensions: '1920x600',
    url: '/uploads/banner-services.jpg',
    thumbnail: '',
    folder: 'banners',
    uploadedAt: '9 มี.ค. 2569',
    uploadedBy: 'สมชาย ใจดี',
  },
  {
    id: '7',
    name: 'vdo-intro.mp4',
    type: 'video',
    size: '45.2 MB',
    url: '/uploads/vdo-intro.mp4',
    thumbnail: '',
    folder: 'activities',
    uploadedAt: '8 มี.ค. 2569',
    uploadedBy: 'สมหญิง รักดี',
  },
  {
    id: '8',
    name: 'แผนพัฒนาท้องถิ่น.pdf',
    type: 'document',
    size: '2.1 MB',
    url: '/uploads/plan.pdf',
    thumbnail: '',
    folder: 'documents',
    uploadedAt: '7 มี.ค. 2569',
    uploadedBy: 'สมชาย ใจดี',
  },
];

const typeIcons = {
  image: ImageIcon,
  document: FileText,
  video: Film,
  other: File,
};

const typeColors = {
  image: 'bg-blue-100 text-blue-600',
  document: 'bg-red-100 text-red-600',
  video: 'bg-purple-100 text-purple-600',
  other: 'bg-gray-100 text-gray-600',
};

const placeholderColors = [
  'bg-gradient-to-br from-blue-200 to-blue-300',
  'bg-gradient-to-br from-green-200 to-green-300',
  'bg-gradient-to-br from-purple-200 to-purple-300',
  'bg-gradient-to-br from-orange-200 to-orange-300',
  'bg-gradient-to-br from-pink-200 to-pink-300',
  'bg-gradient-to-br from-teal-200 to-teal-300',
  'bg-gradient-to-br from-yellow-200 to-yellow-300',
  'bg-gradient-to-br from-indigo-200 to-indigo-300',
];

export default function MediaPage() {
  const [files, setFiles] = useState(demoFiles);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState(demoFolders);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastContainer } = useToast();

  const filteredFiles = files.filter((f) => {
    const matchFolder = selectedFolder === 'all' || f.folder === selectedFolder;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || f.type === filterType;
    return matchFolder && matchSearch && matchType;
  });

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFile?.id === id) setSelectedFile(null);
    showToast('ลบไฟล์สำเร็จ', 'success');
  };

  const handleRename = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: renameValue } : f))
    );
    setRenamingId(null);
    showToast('เปลี่ยนชื่อสำเร็จ', 'success');
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      count: 0,
    };
    setFolders((prev) => [...prev, newFolder]);
    setNewFolderName('');
    setShowNewFolder(false);
    showToast('สร้างโฟลเดอร์สำเร็จ', 'success');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      showToast(`อัปโหลด ${droppedFiles.length} ไฟล์สำเร็จ`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <ImageIcon className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">คลังสื่อ</h1>
              <p className="text-sm text-gray-500">จัดการรูปภาพ เอกสาร และไฟล์มีเดีย</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 transition-colors font-medium"
          >
            <Upload className="w-4 h-4" />
            อัปโหลดไฟล์
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={() => showToast('อัปโหลดไฟล์สำเร็จ', 'success')}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Folders */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">โฟลเดอร์</h3>
                <button
                  type="button"
                  onClick={() => setShowNewFolder(true)}
                  className="p-1 text-gray-400 hover:text-gov-600 hover:bg-gov-50 rounded"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              {showNewFolder && (
                <div className="flex items-center gap-1 mb-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    placeholder="ชื่อโฟลเดอร์"
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-gov-500"
                    autoFocus
                  />
                  <button type="button" onClick={handleCreateFolder} className="p-1 text-green-500 hover:bg-green-50 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setShowNewFolder(false)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-0.5">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFolder === folder.id
                        ? 'bg-gov-50 text-gov-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">{folder.name}</span>
                    <span className="text-xs text-gray-400">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาไฟล์..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 focus:border-gov-500"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 bg-white"
              >
                <option value="all">ทุกประเภท</option>
                <option value="image">รูปภาพ</option>
                <option value="document">เอกสาร</option>
                <option value="video">วิดีโอ</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-gov-50 text-gov-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 border-l border-gray-300 ${viewMode === 'list' ? 'bg-gov-50 text-gov-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upload Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              className={`mb-4 border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragOver
                  ? 'border-gov-500 bg-gov-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-gov-500' : 'text-gray-300'}`} />
              <p className="text-sm text-gray-500">
                ลากไฟล์มาวางที่นี่เพื่ออัปโหลด หรือ{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gov-600 font-medium hover:underline"
                >
                  เลือกไฟล์
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-1">รองรับการอัปโหลดหลายไฟล์พร้อมกัน (Bulk Upload)</p>
            </div>

            {/* Files Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file, idx) => {
                  const Icon = typeIcons[file.type];
                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`group bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedFile?.id === file.id
                          ? 'border-gov-500 ring-2 ring-gov-200'
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className={`aspect-square relative ${placeholderColors[idx % placeholderColors.length]} flex items-center justify-center`}>
                        <Icon className="w-10 h-10 text-white/70" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
                            }}
                            className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[file.type]}`}>
                          {file.type === 'image' ? 'ภาพ' : file.type === 'document' ? 'เอกสาร' : file.type === 'video' ? 'วิดีโอ' : 'อื่นๆ'}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-3">
                        {renamingId === file.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                              className="flex-1 px-1 py-0.5 text-xs border border-gray-300 rounded"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleRename(file.id); }}>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">{file.size}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ชื่อไฟล์</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ประเภท</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ขนาด</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">วันที่อัปโหลด</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => {
                      const Icon = typeIcons[file.type];
                      return (
                        <tr
                          key={file.id}
                          onClick={() => setSelectedFile(file)}
                          className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedFile?.id === file.id ? 'bg-gov-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded ${typeColors[file.type]}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{file.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{file.size}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{file.uploadedAt}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingId(file.id);
                                  setRenameValue(file.name);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(file.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Sidebar - File Details */}
          {selectedFile && (
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">รายละเอียดไฟล์</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview */}
                <div className={`aspect-video rounded-lg mb-4 flex items-center justify-center ${placeholderColors[parseInt(selectedFile.id) % placeholderColors.length]}`}>
                  {(() => {
                    const Icon = typeIcons[selectedFile.type];
                    return <Icon className="w-12 h-12 text-white/70" />;
                  })()}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">ชื่อไฟล์</p>
                    <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ขนาด</p>
                    <p className="text-sm text-gray-700">{selectedFile.size}</p>
                  </div>
                  {selectedFile.dimensions && (
                    <div>
                      <p className="text-xs text-gray-400">ขนาดภาพ</p>
                      <p className="text-sm text-gray-700">{selectedFile.dimensions} px</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400">URL</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-gov-600 font-mono truncate flex-1">{selectedFile.url}</p>
                      <button
                        type="button"
                        onClick={() => showToast('คัดลอก URL แล้ว', 'success')}
                        className="p-1 text-gray-400 hover:text-gov-600 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">อัปโหลดเมื่อ</p>
                    <p className="text-sm text-gray-700">{selectedFile.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">อัปโหลดโดย</p>
                    <p className="text-sm text-gray-700">{selectedFile.uploadedBy}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(selectedFile.id);
                        setRenameValue(selectedFile.name);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      เปลี่ยนชื่อ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedFile.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
