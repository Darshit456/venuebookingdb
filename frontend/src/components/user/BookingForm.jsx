import React, { useState } from 'react';
import { bookingAPI, venueAPI } from '../../services/api';

const BookingForm = ({ venue, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        bookingDate: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Check availability when date changes
        if (name === 'bookingDate' && value) {
            checkAvailability(value);
        }
    };

    const checkAvailability = async (date) => {
        try {
            setCheckingAvailability(true);
            setError(null);
            const response = await venueAPI.checkAvailability(venue.id, date);
            setIsAvailable(response.isAvailable);
            if (!response.isAvailable) {
                setError('This venue is not available on the selected date. Please choose another date.');
            }
        } catch (err) {
            console.error('Error checking availability:', err);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAvailable) {
            setError('This venue is not available on the selected date.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const bookingData = {
                venueId: venue.id,
                ...formData
            };

            await bookingAPI.create(bookingData);
            alert('Booking confirmed successfully!');
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Book Venue</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">{venue.name}</h4>
                        <p className="text-sm text-gray-600">{venue.address}</p>
                        <p className="text-sm font-semibold text-indigo-600 mt-1">
                            ₹{venue.pricePerDay} per day
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                placeholder="10 digit phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Booking Date *
                            </label>
                            <input
                                type="date"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                min={today}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {checkingAvailability && (
                                <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
                            )}
                            {!checkingAvailability && formData.bookingDate && isAvailable && (
                                <p className="text-sm text-green-600 mt-1">✓ Available</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Special Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading || !isAvailable}
                                className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                                    loading || !isAvailable
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                {loading ? 'Booking...' : 'Confirm Booking'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;