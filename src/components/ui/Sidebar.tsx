'use client';

import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/' },
    { id: 'charts', label: 'Charts', icon: '📈', href: '/charts' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', href: '/portfolio' },
    { id: 'watchlist', label: 'Watchlist', icon: '👀', href: '/watchlist' },
    { id: 'news', label: 'News', icon: '📰', href: '/news' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">StockApp</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Portfolio Summary */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Portfolio Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Value</span>
              <span className="text-sm font-semibold text-gray-900">$125,430.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today&apos;s Change</span>
              <span className="text-sm font-semibold text-green-600">+$2,340.25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Return</span>
              <span className="text-sm font-semibold text-green-600">+12.5%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Stock
            </button>
            <button className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
