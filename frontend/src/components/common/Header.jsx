import React, { useState, useEffect } from 'react';

const Header = ({ activeView, setActiveView }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                VenueBook
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-1">
                        <button
                            onClick={() => setActiveView('browse')}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeView === 'browse'
                                    ? 'text-white'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                        >
                            {activeView === 'browse' && (
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></span>
                            )}
                            <span className="relative flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Browse Venues
              </span>
                        </button>
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeView === 'admin'
                                    ? 'text-white'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                        >
                            {activeView === 'admin' && (
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></span>
                            )}
                            <span className="relative flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Admin Panel
              </span>
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                className="h-6 w-6 transition-transform duration-200"
                                style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden transition-all duration-300 ${
                    mobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <nav className="py-4 space-y-2">
                        <button
                            onClick={() => {
                                setActiveView('browse');
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                                activeView === 'browse'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Browse Venues
                        </button>
                        <button
                            onClick={() => {
                                setActiveView('admin');
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                                activeView === 'admin'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Admin Panel
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;