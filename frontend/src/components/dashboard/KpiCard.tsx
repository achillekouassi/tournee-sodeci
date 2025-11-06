import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend
}) => {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">{title}</span>
        <Icon size={16} className={iconColor} />
      </div>
      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
      {trend && (
        <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </Card>
  );
};
