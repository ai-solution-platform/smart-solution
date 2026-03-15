'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Calendar, BarChart3, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
}

const stats: StatItem[] = [
  { label: 'ผู้เข้าชมวันนี้', value: 1247, icon: Eye },
  { label: 'เดือนนี้', value: 38542, icon: Calendar },
  { label: 'ทั้งหมด', value: 1584329, icon: BarChart3 },
  { label: 'ออนไลน์ขณะนี้', value: 42, icon: Users, suffix: ' คน' },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatisticsBar() {
  return (
    <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center text-white">
                <Icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  <AnimatedCounter target={stat.value} />
                  {stat.suffix || ''}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
