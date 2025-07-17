import React, { useState, useEffect } from 'react';
import { venueAPI } from '../../services/api';
import BookingForm from './BookingForm';

const VenueBrowse = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const data = await venueAPI.getAll();
            setVenues(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (venue) => {
        setSelectedVenue(venue);
        setShowBookingForm(true);
    };

    const handleBookingComplete = () => {
        setShowBookingForm(false);
        setSelectedVenue(null);
        fetchVenues();
    };

    // Filter venues based on search and price
    const filteredVenues = venues.filter(venue => {
        const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.address.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesPrice = true;
        if (priceFilter === 'low') matchesPrice = venue.pricePerDay <= 1000;
        else if (priceFilter === 'medium') matchesPrice = venue.pricePerDay > 1000 && venue.pricePerDay <= 2000;
        else if (priceFilter === 'high') matchesPrice = venue.pricePerDay > 2000;

        return matchesSearch && matchesPrice;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <div className="animate-ping absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-indigo-400 opacity-20"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-red-700 font-medium">Error: {error}</p>
                    <button
                        onClick={fetchVenues}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
                <h2 className="text-4xl font-bold mb-3 animate-slideInLeft">Find Your Perfect Venue</h2>
                <p className="text-lg opacity-90 animate-slideInLeft animation-delay-100">
                    Discover amazing spaces for your next event
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slideInUp">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search venues by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                        <option value="all">All Prices</option>
                        <option value="low">Under ₹1,000</option>
                        <option value="medium">₹1,000 - ₹2,000</option>
                        <option value="high">Above ₹2,000</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-gray-600">
                Found <span className="font-semibold text-gray-900">{filteredVenues.length}</span> venues
            </div>

            {filteredVenues.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500 text-lg">No venues found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.map((venue, index) => (
                        <div
                            key={venue.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slideInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500">
                                {venue.imageUrl ? (
                                    <img
                                        src={venue.imageUrl}
                                        alt={venue.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <svg className="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                                    <span className="text-sm font-semibold text-indigo-600">₹{venue.pricePerDay}/day</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>

                                <div className="flex items-center text-gray-600 text-sm mb-3">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {venue.address}
                                </div>

                                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{venue.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">{venue.capacity} guests</span>
                                    </div>
                                    <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        venue.unavailableDates?.length > 5 ? 'bg-red-100 text-red-800' :
                            venue.unavailableDates?.length > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                    }`}>
                      {venue.unavailableDates?.length > 5 ? 'Limited' :
                          venue.unavailableDates?.length > 0 ? 'Mostly Available' :
                              'Available'}
                    </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBookNow(venue)}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {showBookingForm && selectedVenue && (
                <BookingForm
                    venue={selectedVenue}
                    onClose={() => setShowBookingForm(false)}
                    onSuccess={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default VenueBrowse;