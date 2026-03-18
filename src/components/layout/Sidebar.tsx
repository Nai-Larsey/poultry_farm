import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Bird, Egg, ThermometerSun, Wheat, Settings } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Flock Management', icon: Bird, href: '/dashboard/flocks' },
    { name: 'Egg Production', icon: Egg, href: '/dashboard/eggs' },
    { name: 'Climate Control', icon: ThermometerSun, href: '/dashboard/climate' },
    { name: 'Feed & Nutrition', icon: Wheat, href: '/dashboard/feed' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="w-64 bg-green-900 min-h-screen text-white flex flex-col">
      <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-green-800">
        <span className="text-amber-500 mr-2">Agri</span>Tech
      </div>
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
          >
            <item.icon className="w-5 h-5 mr-3 text-amber-500" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-green-800 text-xs text-green-200">
        Poultry PMS v1.0
      </div>
    </div>
  );
};
