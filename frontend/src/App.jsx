import React, { useState } from 'react';
import Header from './components/common/Header';
import VenueBrowse from './components/user/VenueBrowse';
import VenueList from './components/admin/VenueList';

function App() {
    const [activeView, setActiveView] = useState('browse');

    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeView === 'browse' ? <VenueBrowse /> : <VenueList />}
            </main>
            <footer className="bg-white mt-auto border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-500 text-sm">
                        © 2025 Venue Booking System. Created for Eazyvenue.com
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;