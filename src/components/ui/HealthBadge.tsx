import React from 'react';

type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

interface HealthBadgeProps {
  status: HealthStatus;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-800 text-white border-green-900';
      case 'Warning':
        return 'bg-amber-500 text-white border-amber-600';
      case 'Critical':
        return 'bg-red-600 text-white border-red-700';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles()}`}
    >
      {status}
    </span>
  );
};
