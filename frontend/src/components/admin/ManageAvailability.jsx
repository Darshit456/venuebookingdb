import React, { useState, useEffect } from 'react';
import { venueAPI, bookingAPI } from '../../services/api';

const ManageAvailability = ({ venue, onClose, onSuccess }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, [venue.id]);

    const fetchBookings = async () => {
        try {
            setLoadingBookings(true);
            const data = await bookingAPI.getByVenue(venue.id);
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleDateToggle = (date) => {
        setSelectedDates(prev => {
            const dateStr = date.toISOString().split('T')[0];
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            }
            return [...prev, dateStr];
        });
    };

    const handleBlockDates = async () => {
        if (selectedDates.length === 0) {
            setError('Please select at least one date to block');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await venueAPI.updateAvailability({
                venueId: venue.id,
                blockDates: selectedDates.map(d => new Date(d).toISOString()),
                unblockDates: [],
                reason: reason || 'Blocked by admin'
            });

            alert('Dates blocked successfully!');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockDates = async () => {
        const datesToUnblock = venue.unavailableDates
            ?.filter(d => selectedDates.includes(new Date(d).toISOString().split('T')[0]))
            .map(d => new Date(d).toISOString()) || [];

        if (datesToUnblock.length === 0) {
            setError('Please select blocked dates to unblock');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await venueAPI.updateAvailability({
                venueId: venue.id,
                blockDates: [],
                unblockDates: datesToUnblock,
                reason: ''
            });

            alert('Dates unblocked successfully!');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    // Generate calendar days for the next 60 days
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 60; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }

        return days;
    };

    const isDateBlocked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return venue.unavailableDates?.some(d =>
            new Date(d).toISOString().split('T')[0] === dateStr
        );
    };

    const isDateBooked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return venue.bookedDates?.some(d =>
            new Date(d).toISOString().split('T')[0] === dateStr
        );
    };

    const days = generateCalendarDays();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Manage Availability - {venue.name}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                <span>Blocked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                                <span>Booked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                                <span>Selected</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Select Dates:</h4>
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((date, index) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const isBlocked = isDateBlocked(date);
                                const isBooked = isDateBooked(date);
                                const isSelected = selectedDates.includes(dateStr);
                                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isPast && !isBooked && handleDateToggle(date)}
                                        disabled={isPast || isBooked}
                                        className={`p-2 text-sm rounded-md border transition-colors ${
                                            isPast
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isBooked
                                                    ? 'bg-blue-100 border-blue-300 text-blue-700 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                                        : isBlocked
                                                            ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        <div className="font-semibold">{date.getDate()}</div>
                                        <div className="text-xs">
                                            {date.toLocaleDateString('en', { month: 'short' })}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for blocking (optional)
                        </label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Maintenance, Private event"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleBlockDates}
                            disabled={loading || selectedDates.length === 0}
                            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                                loading || selectedDates.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            Block Selected Dates
                        </button>
                        <button
                            onClick={handleUnblockDates}
                            disabled={loading || selectedDates.length === 0}
                            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                                loading || selectedDates.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            Unblock Selected Dates
                        </button>
                    </div>

                    {/* Recent Bookings */}
                    {!loadingBookings && bookings.length > 0 && (
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-semibold mb-2">Recent Bookings:</h4>
                            <div className="max-h-40 overflow-y-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="text-left text-gray-600">
                                        <th className="pb-2">Date</th>
                                        <th className="pb-2">Customer</th>
                                        <th className="pb-2">Contact</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bookings.slice(0, 5).map((booking) => (
                                        <tr key={booking.id} className="border-t">
                                            <td className="py-1">
                                                {new Date(booking.bookingDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-1">{booking.customerName}</td>
                                            <td className="py-1">{booking.customerPhone}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAvailability;