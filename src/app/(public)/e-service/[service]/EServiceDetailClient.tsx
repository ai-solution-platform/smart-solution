'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Building,
  CalendarClock,
  Wrench,
  FileSearch,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Upload,
  MapPin,
  Camera,
  X,
  Info,
} from 'lucide-react';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

// --- Service metadata ---

interface ServiceMeta {
  slug: string;
  title: string;
  description: string;
  icon: typeof CreditCard;
  color: string;
  bgColor: string;
}

const serviceMeta: Record<string, ServiceMeta> = {
  'tax-payment': {
    slug: 'tax-payment',
    title: 'ชำระภาษีออนไลน์',
    description: 'ชำระภาษีที่ดินและสิ่งปลูกสร้าง ภาษีป้าย และค่าธรรมเนียมต่าง ๆ',
    icon: CreditCard,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  'building-permit': {
    slug: 'building-permit',
    title: 'ขออนุญาตก่อสร้าง',
    description: 'ยื่นคำขออนุญาตก่อสร้าง ดัดแปลง รื้อถอนอาคาร',
    icon: Building,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  'queue-booking': {
    slug: 'queue-booking',
    title: 'จองคิวออนไลน์',
    description: 'นัดหมายล่วงหน้าเพื่อรับบริการที่เทศบาล',
    icon: CalendarClock,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  'report-issue': {
    slug: 'report-issue',
    title: 'แจ้งซ่อมสาธารณูปโภค',
    description: 'แจ้งปัญหาถนนชำรุด ไฟฟ้าดับ น้ำประปา ท่อระบายน้ำ',
    icon: Wrench,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  'information-request': {
    slug: 'information-request',
    title: 'ขอข้อมูลข่าวสาร',
    description: 'ยื่นคำขอข้อมูลข่าวสารตาม พ.ร.บ. ข้อมูลข่าวสารของราชการ',
    icon: FileSearch,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  'civil-registration': {
    slug: 'civil-registration',
    title: 'ทะเบียนราษฎร',
    description: 'บริการด้านทะเบียนราษฎร แจ้งเกิด แจ้งตาย แจ้งย้ายที่อยู่',
    icon: FileSearch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
};

// Services that don't require auth
const publicServices = ['report-issue', 'civil-registration'];

// --- Component ---

export default function EServiceDetailClient() {
  const params = useParams();
  const serviceSlug = params.service as string;
  const meta = serviceMeta[serviceSlug];
  const { isLoggedIn, citizen, token } = useCitizenAuth();
  const requiresAuth = !publicServices.includes(serviceSlug);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  // Form states for different service types
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);

  // Pre-fill name/contact if logged in
  useEffect(() => {
    if (isLoggedIn && citizen) {
      setFormData((prev) => ({
        ...prev,
        name: citizen.name || '',
        phone: citizen.phone || '',
        email: citizen.email || '',
      }));
    }
  }, [isLoggedIn, citizen]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบบริการ</h1>
          <p className="text-gray-500 mb-6">บริการที่คุณเลือกไม่มีในระบบ</p>
          <Link
            href="/e-service"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับหน้าบริการออนไลน์
          </Link>
        </div>
      </div>
    );
  }

  // If requires auth and not logged in
  if (requiresAuth && !isLoggedIn) {
    const IconComponent = meta.icon;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/e-service"
              className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับหน้าบริการออนไลน์
            </Link>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${meta.bgColor} flex items-center justify-center`}>
                <IconComponent className={`w-7 h-7 ${meta.color}`} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{meta.title}</h1>
                <p className="text-blue-100 mt-1">{meta.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <IconComponent className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              กรุณาเข้าสู่ระบบเพื่อใช้บริการ
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              บริการ{meta.title}ต้องยืนยันตัวตนก่อนใช้งาน เพื่อความปลอดภัยและสามารถติดตามสถานะคำขอได้
            </p>
            <AuthPrompt
              message={`เข้าสู่ระบบเพื่อใช้บริการ${meta.title}`}
              returnUrl={`/e-service/${serviceSlug}`}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = Array.from(files).slice(0, 5 - photos.length);
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.name?.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (!formData.phone?.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';

    // Service-specific validations
    switch (serviceSlug) {
      case 'tax-payment':
        if (!formData.taxType) newErrors.taxType = 'กรุณาเลือกประเภทภาษี';
        if (!formData.propertyAddress?.trim()) newErrors.propertyAddress = 'กรุณากรอกที่อยู่ทรัพย์สิน';
        if (!formData.paymentMethod) newErrors.paymentMethod = 'กรุณาเลือกวิธีชำระเงิน';
        break;
      case 'building-permit':
        if (!formData.propertyAddress?.trim()) newErrors.propertyAddress = 'กรุณากรอกที่อยู่ที่ดิน';
        if (!formData.buildingType) newErrors.buildingType = 'กรุณาเลือกประเภทอาคาร';
        if (!formData.area?.trim()) newErrors.area = 'กรุณากรอกพื้นที่';
        break;
      case 'queue-booking':
        if (!formData.department) newErrors.department = 'กรุณาเลือกแผนก';
        if (!formData.date) newErrors.date = 'กรุณาเลือกวันที่';
        if (!formData.timeSlot) newErrors.timeSlot = 'กรุณาเลือกช่วงเวลา';
        if (!formData.purpose?.trim()) newErrors.purpose = 'กรุณาระบุเรื่องที่ต้องการติดต่อ';
        break;
      case 'report-issue':
        if (!formData.issueType) newErrors.issueType = 'กรุณาเลือกประเภทปัญหา';
        if (!formData.location?.trim()) newErrors.location = 'กรุณาระบุสถานที่';
        if (!formData.description?.trim()) newErrors.description = 'กรุณาอธิบายรายละเอียดปัญหา';
        break;
      case 'information-request':
        if (!formData.requestDetail?.trim()) newErrors.requestDetail = 'กรุณาระบุข้อมูลที่ต้องการ';
        if (!formData.purpose?.trim()) newErrors.purpose = 'กรุณาระบุวัตถุประสงค์';
        break;
      case 'civil-registration':
        if (!formData.idCard?.trim()) newErrors.idCard = 'กรุณากรอกเลขบัตรประชาชน';
        if (!formData.serviceType) newErrors.serviceType = 'กรุณาเลือกประเภทบริการ';
        if (!formData.currentAddress?.trim()) newErrors.currentAddress = 'กรุณากรอกที่อยู่';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');

    // Demo mode: simulate API call with mock response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const prefix = serviceSlug === 'tax-payment' ? 'TAX' :
                   serviceSlug === 'building-permit' ? 'BLD' :
                   serviceSlug === 'queue-booking' ? 'QUE' :
                   serviceSlug === 'report-issue' ? 'RPT' :
                   serviceSlug === 'civil-registration' ? 'REG' :
                   serviceSlug === 'information-request' ? 'INF' : 'SRV';
    const num = String(Math.floor(Math.random() * 90000) + 10000);
    setReferenceNumber(`${prefix}-2568-${num}`);
    setSubmitted(true);
    setSubmitting(false);
  };

  const IconComponent = meta.icon;

  // --- Render success ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold">{meta.title}</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">ส่งคำขอสำเร็จ!</h2>
            <p className="text-gray-500 mb-6">
              คำขอของคุณได้รับการบันทึกเรียบร้อยแล้ว
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 inline-block">
              <p className="text-sm text-blue-600 mb-1">หมายเลขอ้างอิง</p>
              <p className="text-2xl font-bold text-blue-800 font-mono">{referenceNumber}</p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              กรุณาจดหมายเลขอ้างอิงนี้ไว้เพื่อใช้ติดตามสถานะ
              <br />
              เจ้าหน้าที่จะดำเนินการและแจ้งผลให้ทราบ
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/e-service"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                กลับหน้าบริการออนไลน์
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Field helper ---
  const renderField = (
    label: string,
    field: string,
    type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select' = 'text',
    options?: { value: string; label: string }[],
    placeholder?: string,
    helpText?: string
  ) => {
    const hasError = !!errors[field];
    const baseClass = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        {type === 'textarea' ? (
          <textarea
            rows={4}
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={`${baseClass} resize-none`}
            placeholder={placeholder}
          />
        ) : type === 'select' ? (
          <select
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={baseClass}
          >
            <option value="">-- กรุณาเลือก --</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={baseClass}
            placeholder={placeholder}
          />
        )}
        {helpText && !hasError && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {helpText}
          </p>
        )}
        {hasError && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  // --- Service-specific forms ---
  const renderServiceForm = () => {
    switch (serviceSlug) {
      case 'tax-payment':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
            </div>
            {renderField('ประเภทภาษี', 'taxType', 'select', [
              { value: 'land', label: 'ภาษีที่ดินและสิ่งปลูกสร้าง' },
              { value: 'sign', label: 'ภาษีป้าย' },
              { value: 'fee', label: 'ค่าธรรมเนียม' },
            ])}
            {renderField('ที่อยู่ทรัพย์สิน', 'propertyAddress', 'textarea', undefined, 'ระบุที่อยู่ที่ดินหรือทรัพย์สินที่ต้องชำระภาษี')}
            {renderField('จำนวนเงิน (บาท)', 'amount', 'number', undefined, '0.00', 'ระบุจำนวนเงินตามใบแจ้งภาษี หากไม่ทราบให้เว้นว่าง')}
            {renderField('วิธีชำระเงิน', 'paymentMethod', 'select', [
              { value: 'promptpay', label: 'PromptPay (QR Code)' },
              { value: 'card', label: 'บัตรเครดิต/เดบิต' },
              { value: 'bank', label: 'Internet Banking' },
              { value: 'counter', label: 'ชำระที่เคาน์เตอร์เซอร์วิส' },
            ])}
            {renderField('หมายเหตุเพิ่มเติม', 'notes', 'textarea', undefined, 'ข้อมูลเพิ่มเติม (ถ้ามี)')}
          </>
        );

      case 'building-permit':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล (ผู้ขออนุญาต)', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
            </div>
            {renderField('ที่อยู่ที่ดิน/สถานที่ก่อสร้าง', 'propertyAddress', 'textarea', undefined, 'ระบุที่อยู่ เลขที่โฉนด หรือจุดสังเกต')}
            {renderField('ประเภทอาคาร', 'buildingType', 'select', [
              { value: 'house', label: 'บ้านพักอาศัย' },
              { value: 'townhouse', label: 'ทาวน์เฮ้าส์' },
              { value: 'commercial', label: 'อาคารพาณิชย์' },
              { value: 'factory', label: 'โรงงาน/คลังสินค้า' },
              { value: 'renovation', label: 'ต่อเติม/ดัดแปลง' },
              { value: 'demolish', label: 'รื้อถอน' },
              { value: 'other', label: 'อื่น ๆ' },
            ])}
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('พื้นที่ก่อสร้าง (ตร.ม.)', 'area', 'number', undefined, '0', 'พื้นที่ใช้สอยรวมทุกชั้น')}
              {renderField('จำนวนชั้น', 'floors', 'number', undefined, '1')}
            </div>
            {renderField('รายละเอียดเพิ่มเติม', 'details', 'textarea', undefined, 'อธิบายลักษณะอาคาร วัตถุประสงค์การใช้งาน')}
            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                แนบเอกสาร (แบบแปลน, สำเนาโฉนด)
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">คลิกเพื่อแนบไฟล์</span>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </label>
            </div>
          </>
        );

      case 'queue-booking':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
            </div>
            {renderField('แผนก/ส่วนงาน', 'department', 'select', [
              { value: 'general', label: 'สำนักปลัดเทศบาล' },
              { value: 'finance', label: 'กองคลัง' },
              { value: 'engineering', label: 'กองช่าง' },
              { value: 'health', label: 'กองสาธารณสุขและสิ่งแวดล้อม' },
              { value: 'education', label: 'กองการศึกษา' },
              { value: 'welfare', label: 'กองสวัสดิการสังคม' },
            ])}
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('วันที่', 'date', 'date', undefined, undefined, 'เลือกวันจันทร์-ศุกร์ (ไม่รวมวันหยุด)')}
              {renderField('ช่วงเวลา', 'timeSlot', 'select', [
                { value: '09:00', label: '09:00 - 10:00 น.' },
                { value: '10:00', label: '10:00 - 11:00 น.' },
                { value: '11:00', label: '11:00 - 12:00 น.' },
                { value: '13:00', label: '13:00 - 14:00 น.' },
                { value: '14:00', label: '14:00 - 15:00 น.' },
                { value: '15:00', label: '15:00 - 16:00 น.' },
              ])}
            </div>
            {renderField('เรื่องที่ต้องการติดต่อ', 'purpose', 'textarea', undefined, 'ระบุเรื่องที่ต้องการติดต่อ เช่น ยื่นคำร้อง ขอใบอนุญาต ฯลฯ')}
          </>
        );

      case 'report-issue':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
            </div>
            {renderField('ประเภทปัญหา', 'issueType', 'select', [
              { value: 'road', label: 'ถนนชำรุด/หลุมบ่อ' },
              { value: 'light', label: 'ไฟฟ้าสาธารณะดับ/ชำรุด' },
              { value: 'water', label: 'น้ำประปา' },
              { value: 'drain', label: 'ท่อระบายน้ำอุดตัน' },
              { value: 'trash', label: 'ขยะ/ความสะอาด' },
              { value: 'park', label: 'สวนสาธารณะ/พื้นที่สีเขียว' },
              { value: 'other', label: 'อื่น ๆ' },
            ])}
            {renderField(
              'สถานที่',
              'location',
              'text',
              undefined,
              'ระบุถนน ซอย ตำแหน่ง หรือจุดสังเกต',
              'ระบุให้ชัดเจนเพื่อให้เจ้าหน้าที่ค้นหาได้'
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                พิกัดบนแผนที่ (ไม่บังคับ)
              </label>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">คลิกเพื่อเลือกตำแหน่งบนแผนที่</p>
                </div>
              </div>
            </div>
            {renderField('รายละเอียดปัญหา', 'description', 'textarea', undefined, 'อธิบายลักษณะปัญหาที่พบ เช่น ขนาด ความรุนแรง ฯลฯ')}
            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ภาพถ่าย (สูงสุด 5 ภาพ)
              </label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">เพิ่มรูป</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoAdd}
                    />
                  </label>
                )}
              </div>
            </div>
          </>
        );

      case 'information-request':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
            </div>
            {renderField('อีเมล', 'email', 'email', undefined, 'example@email.com')}
            {renderField('ข้อมูลที่ต้องการขอ', 'requestDetail', 'textarea', undefined, 'ระบุรายละเอียดข้อมูลข่าวสารที่ต้องการ')}
            {renderField('วัตถุประสงค์ในการขอข้อมูล', 'purpose', 'textarea', undefined, 'ระบุวัตถุประสงค์หรือเหตุผลในการขอข้อมูล')}
            {renderField('วิธีรับข้อมูล', 'deliveryMethod', 'select', [
              { value: 'email', label: 'ทางอีเมล' },
              { value: 'pickup', label: 'มารับด้วยตนเอง' },
              { value: 'mail', label: 'ส่งทางไปรษณีย์' },
            ])}
          </>
        );

      case 'civil-registration':
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('ชื่อ-นามสกุล', 'name', 'text', undefined, 'กรอกชื่อ-นามสกุล')}
              {renderField('เลขบัตรประชาชน', 'idCard', 'text', undefined, 'X-XXXX-XXXXX-XX-X')}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {renderField('เบอร์โทรศัพท์', 'phone', 'tel', undefined, '08X-XXX-XXXX')}
              {renderField('อีเมล', 'email', 'email', undefined, 'example@email.com')}
            </div>
            {renderField('ประเภทบริการ', 'serviceType', 'select', [
              { value: 'birth', label: 'แจ้งเกิด' },
              { value: 'death', label: 'แจ้งตาย' },
              { value: 'move-in', label: 'แจ้งย้ายเข้า' },
              { value: 'move-out', label: 'แจ้งย้ายออก' },
              { value: 'name-change', label: 'เปลี่ยนชื่อ-สกุล' },
              { value: 'copy', label: 'คัดสำเนาทะเบียนบ้าน' },
              { value: 'correction', label: 'แก้ไขรายการในทะเบียนบ้าน' },
            ])}
            {renderField('ที่อยู่ปัจจุบัน (ตามทะเบียนบ้าน)', 'currentAddress', 'textarea', undefined, 'เลขที่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์')}
            {renderField('รายละเอียดเพิ่มเติม', 'details', 'textarea', undefined, 'ระบุรายละเอียดเพิ่มเติม เช่น กรณีแจ้งย้ายให้ระบุที่อยู่ใหม่')}
            {renderField('วันที่ต้องการนัดหมาย', 'appointmentDate', 'date', undefined, undefined, 'เลือกวันจันทร์-ศุกร์ เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยัน')}
            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                แนบเอกสาร (บัตรประชาชน, สำเนาทะเบียนบ้าน)
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">คลิกเพื่อแนบไฟล์ (PDF, JPG, PNG)</span>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </label>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                แนะนำให้แนบสำเนาบัตรประชาชนและสำเนาทะเบียนบ้านเพื่อความรวดเร็ว
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/e-service"
            className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าบริการออนไลน์
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${meta.bgColor} flex items-center justify-center`}>
              <IconComponent className={`w-7 h-7 ${meta.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{meta.title}</h1>
              <p className="text-blue-100 mt-1">{meta.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logged in indicator */}
        {isLoggedIn && citizen && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>
              กำลังใช้บริการในนาม <strong>{citizen.name}</strong>
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            กรอกข้อมูลคำขอ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {renderServiceForm()}

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">ส่งคำขอไม่สำเร็จ</p>
                  <p className="text-sm text-red-600 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    กำลังส่งคำขอ...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ส่งคำขอ
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
