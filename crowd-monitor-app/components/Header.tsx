'use client';

import { Menu, Bell, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Crowd<span className="text-blue-600">Cast</span></h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Smart Crowd Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            Dashboard
                        </a>
                        <a href="/venues" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            Venues
                        </a>
                        <a href="/about" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            How It Works
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">Guest</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
