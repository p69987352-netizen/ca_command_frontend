import React from 'react';
import { Card, CardContent } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-saas-muted">{title}</p>
            <h4 className="text-2xl font-bold text-saas-text mt-2">{value}</h4>
          </div>
          {icon && (
            <div className="p-3 bg-white/5 rounded-[12px] text-saas-primary">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={trend.isPositive ? 'text-saas-success' : 'text-saas-danger'}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-saas-muted ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
