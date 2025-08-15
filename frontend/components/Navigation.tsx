'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, BarChart3, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav w-64 fixed h-full z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ZapBoard</h1>
            <p className="text-xs text-gray-500 font-medium">Project Management</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'nav-link group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg',
                    isActive && 'active'
                  )}
                >
                  <Icon
                    className={cn(
                      'nav-icon mr-3 h-4 w-4',
                      isActive && 'active'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
