'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Building,
  Users,
  FileSearch,
  CalendarClock,
  Wrench,
  ArrowRight,
  Shield,
  Bell,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Star,
  LogIn,
} from 'lucide-react';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

interface ServiceItem {
  id: string;
  slug: string;
  icon: typeof CreditCard;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  active: boolean;
  requiresAuth: boolean;
}

const services: ServiceItem[] = [
  {
    id: '1',
    slug: 'tax-payment',
    icon: CreditCard,
    title: 'ชำระภาษีออนไลน์',
    description: 'ชำระภาษีที่ดินและสิ่งปลูกสร้าง ภาษีป้าย และค่าธรรมเนียมต่าง ๆ ผ่านระบบออนไลน์',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    active: true,
    requiresAuth: true,
  },
  {
    id: '2',
    slug: 'building-permit',
    icon: Building,
    title: 'ขออนุญาตก่อสร้าง',
    description: 'ยื่นคำขออนุญาตก่อสร้าง ดัดแปลง รื้อถอนอาคาร และติดตามสถานะคำขอ',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    active: true,
    requiresAuth: true,
  },
  {
    id: '3',
    slug: 'civil-registration',
    icon: Users,
    title: 'ทะเบียนราษฎร',
    description: 'บริการด้านทะเบียนราษฎร แจ้งเกิด แจ้งตาย แจ้งย้ายที่อยู่',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    active: false,
    requiresAuth: true,
  },
  {
    id: '4',
    slug: 'information-request',
    icon: FileSearch,
    title: 'ขอข้อมูลข่าวสาร',
    description: 'ยื่นคำขอข้อมูลข่าวสารตาม พ.ร.บ. ข้อมูลข่าวสารของราชการ พ.ศ. 2540',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    active: true,
    requiresAuth: true,
  },
  {
    id: '5',
    slug: 'queue-booking',
    icon: CalendarClock,
    title: 'จองคิวออนไลน์',
    description: 'นัดหมายล่วงหน้าเพื่อรับบริการที่เทศบาล ลดเวลารอคิว',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    active: true,
    requiresAuth: true,
  },
  {
    id: '6',
    slug: 'report-issue',
    icon: Wrench,
    title: 'แจ้งซ่อมสาธารณูปโภค',
    description: 'แจ้งปัญหาถนนชำรุด ไฟฟ้าดับ น้ำประปา ท่อระบายน้ำ และอื่น ๆ',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    active: true,
    requiresAuth: false,
  },
];

const faqs = [
  {
    q: 'ต้องสมัครสมาชิกก่อนใช้บริการ e-Service หรือไม่?',
    a: 'บริการส่วนใหญ่ต้องเข้าสู่ระบบก่อนใช้งาน เพื่อยืนยันตัวตนและติดตามสถานะคำขอ บางบริการเช่น แจ้งซ่อมสาธารณูปโภค สามารถใช้งานได้โดยไม่ต้องเข้าสู่ระบบ',
  },
  {
    q: 'สามารถติดตามสถานะคำขอได้อย่างไร?',
    a: 'หลังจากส่งคำขอ ท่านจะได้รับหมายเลขอ้างอิง (Reference Number) สามารถใช้หมายเลขนี้ติดตามสถานะได้ที่หน้า "ติดตามสถานะ" หรือในหน้าโปรไฟล์ของท่าน',
  },
  {
    q: 'ชำระเงินผ่านช่องทางใดได้บ้าง?',
    a: 'รองรับการชำระเงินผ่าน PromptPay (QR Code), บัตรเครดิต/เดบิต, Internet Banking และชำระที่เคาน์เตอร์เซอร์วิส',
  },
  {
    q: 'ใช้เวลาดำเนินการกี่วัน?',
    a: 'ระยะเวลาขึ้นอยู่กับประเภทบริการ โดยทั่วไป 3-15 วันทำการ ท่านสามารถดูรายละเอียดระยะเวลาได้ในแต่ละบริการ',
  },
];

export default function EServicePage() {
  const { isLoggedIn } = useCitizenAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const handleServiceClick = (service: ServiceItem) => {
    if (!service.active) return;
    if (service.requiresAuth && !isLoggedIn) {
      router.push(`/citizen/login?returnUrl=${encodeURIComponent(`/e-service/${service.slug}`)}`);
      return;
    }
    router.push(`/e-service/${service.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              บริการออนไลน์ (e-Service)
            </h1>
            <p className="text-blue-100 text-lg md:text-xl">
              บริการภาครัฐออนไลน์ สะดวก รวดเร็ว ทุกที่ทุกเวลา
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-200">
              <Link href="/" className="hover:text-white">
                หน้าแรก
              </Link>
              <span>/</span>
              <span>บริการออนไลน์</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth prompt if not logged in */}
        {!isLoggedIn && (
          <div className="mb-10">
            <AuthPrompt
              message="เข้าสู่ระบบเพื่อใช้บริการออนไลน์ได้สะดวกยิ่งขึ้น"
              returnUrl="/e-service"
            />
          </div>
        )}

        {/* Service Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isDisabled = !service.active;

            return (
              <div
                key={service.id}
                className={`relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all ${
                  isDisabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
                onClick={() => handleServiceClick(service)}
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  {service.active ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      เปิดให้บริการ
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                      เร็ว ๆ นี้
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-5`}
                >
                  <IconComponent className={`w-8 h-8 ${service.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{service.description}</p>

                {/* Action */}
                <div className="flex items-center justify-between">
                  {service.requiresAuth && !isLoggedIn ? (
                    <span className="flex items-center gap-1.5 text-sm text-amber-600">
                      <LogIn className="w-4 h-4" />
                      ต้องเข้าสู่ระบบ
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    disabled={isDisabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    เข้าใช้บริการ
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Banner */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ทำไมต้องสมัครสมาชิก?
            </h2>
            <p className="text-blue-100">สิทธิประโยชน์ที่จะได้รับเมื่อลงทะเบียนใช้งาน</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'ประหยัดเวลา',
                desc: 'ไม่ต้องเดินทางมาที่เทศบาล ทำธุรกรรมได้ 24 ชั่วโมง',
              },
              {
                icon: Bell,
                title: 'แจ้งเตือนอัตโนมัติ',
                desc: 'รับการแจ้งเตือนเมื่อคำขอมีการอัพเดทสถานะ',
              },
              {
                icon: Shield,
                title: 'ปลอดภัย',
                desc: 'ข้อมูลส่วนบุคคลได้รับการปกป้องตาม PDPA',
              },
              {
                icon: Star,
                title: 'ติดตามง่าย',
                desc: 'ดูประวัติการใช้บริการและติดตามสถานะคำขอทั้งหมด',
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-blue-100">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            คำถามที่พบบ่อย
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
