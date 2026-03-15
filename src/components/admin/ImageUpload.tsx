'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileWarning } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (file: File | null, previewUrl: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
  description?: string;
  aspectRatio?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/svg+xml,image/webp',
  maxSizeMB = 5,
  description,
  aspectRatio,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      if (!acceptedTypes.includes(file.type)) {
        setError(`ไฟล์ประเภท ${file.type} ไม่รองรับ กรุณาอัปโหลดไฟล์ ${accept}`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`ขนาดไฟล์เกิน ${maxSizeMB} MB กรุณาเลือกไฟล์ที่เล็กกว่า`);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreview(url);
        onChange(file, url);
      };
      reader.readAsDataURL(file);
    },
    [onChange, accept, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}

      {preview ? (
        <div className="relative group rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
          <img
            src={preview}
            alt={label}
            className="w-full h-40 object-contain p-2"
            style={aspectRatio ? { aspectRatio } : undefined}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg hover:bg-gray-100 font-medium"
            >
              เปลี่ยน
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 font-medium"
            >
              ลบ
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-gov-500 bg-gov-50'
              : 'border-gray-300 hover:border-gov-400 hover:bg-gray-50'
          }`}
        >
          <Upload className={`w-8 h-8 ${isDragOver ? 'text-gov-500' : 'text-gray-400'}`} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              ลากไฟล์มาวางที่นี่ หรือ <span className="text-gov-500">คลิกเพื่อเลือก</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              รองรับ PNG, JPG, SVG, WEBP (สูงสุด {maxSizeMB} MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
          <FileWarning className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}
