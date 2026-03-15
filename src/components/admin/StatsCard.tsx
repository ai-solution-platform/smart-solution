'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'indigo';
}

const colorMap = {
  blue: {
    circle: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  green: {
    circle: 'bg-green-100',
    icon: 'text-green-600',
  },
  orange: {
    circle: 'bg-orange-100',
    icon: 'text-orange-600',
  },
  red: {
    circle: 'bg-red-100',
    icon: 'text-red-600',
  },
  purple: {
    circle: 'bg-purple-100',
    icon: 'text-purple-600',
  },
  indigo: {
    circle: 'bg-indigo-100',
    icon: 'text-indigo-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-400 ml-1">จากเดือนก่อน</span>
            </div>
          )}
        </div>
        <div className={`${colors.circle} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
