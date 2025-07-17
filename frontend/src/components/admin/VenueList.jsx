import React, { useState, useEffect } from 'react';
import { venueAPI } from '../../services/api';
import AddVenue from './AddVenue';
import ManageAvailability from './ManageAvailability';

const VenueList = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddVenue, setShowAddVenue] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showManageAvailability, setShowManageAvailability] = useState(false);

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

    const handleAddVenue = () => {
        setShowAddVenue(true);
    };

    const handleVenueAdded = () => {
        setShowAddVenue(false);
        fetchVenues();
    };

    const handleManageAvailability = (venue) => {
        setSelectedVenue(venue);
        setShowManageAvailability(true);
    };

    const handleAvailabilityUpdated = () => {
        setShowManageAvailability(false);
        setSelectedVenue(null);
        fetchVenues();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={fetchVenues}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Venues</h2>
                    <p className="text-gray-600">Add and manage your venue listings</p>
                </div>
                <button
                    onClick={handleAddVenue}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Venue
                </button>
            </div>

            {venues.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No venues added yet.</p>
                    <button
                        onClick={handleAddVenue}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Add Your First Venue
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Venue Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capacity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price/Day
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Availability
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {venues.map((venue) => (
                            <tr key={venue.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {venue.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {venue.address}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{venue.capacity} people</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">
                                        ₹{venue.pricePerDay}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        <div className="text-gray-900">
                                            {venue.unavailableDates?.length || 0} blocked dates
                                        </div>
                                        <div className="text-gray-500">
                                            {venue.bookedDates?.length || 0} bookings
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        onClick={() => handleManageAvailability(venue)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                                    >
                                        Manage Availability
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Venue Modal */}
            {showAddVenue && (
                <AddVenue
                    onClose={() => setShowAddVenue(false)}
                    onSuccess={handleVenueAdded}
                />
            )}

            {/* Manage Availability Modal */}
            {showManageAvailability && selectedVenue && (
                <ManageAvailability
                    venue={selectedVenue}
                    onClose={() => setShowManageAvailability(false)}
                    onSuccess={handleAvailabilityUpdated}
                />
            )}
        </div>
    );
};

export default VenueList;