const API_URL = '/api';

// Venue APIs
export const venueAPI = {
    // Get all venues
    getAll: async () => {
        const response = await fetch(`${API_URL}/venues`);
        if (!response.ok) throw new Error('Failed to fetch venues');
        return response.json();
    },

    // Get venue by ID
    getById: async (id) => {
        const response = await fetch(`${API_URL}/venues/${id}`);
        if (!response.ok) throw new Error('Failed to fetch venue');
        return response.json();
    },

    // Create new venue
    create: async (venueData) => {
        const response = await fetch(`${API_URL}/venues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venueData)
        });
        if (!response.ok) throw new Error('Failed to create venue');
        return response.json();
    },

    // Update venue availability
    updateAvailability: async (availabilityData) => {
        const response = await fetch(`${API_URL}/venues/availability`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(availabilityData)
        });
        if (!response.ok) throw new Error('Failed to update availability');
        return response.json();
    },

    // Check availability for specific date
    checkAvailability: async (venueId, date) => {
        const response = await fetch(`${API_URL}/venues/${venueId}/availability/${date}`);
        if (!response.ok) throw new Error('Failed to check availability');
        return response.json();
    }
};

// Booking APIs
export const bookingAPI = {
    // Create booking
    create: async (bookingData) => {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create booking');
        }
        return response.json();
    },

    // Get bookings by venue
    getByVenue: async (venueId) => {
        const response = await fetch(`${API_URL}/bookings/venue/${venueId}`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    // Get booking by ID
    getById: async (id) => {
        const response = await fetch(`${API_URL}/bookings/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        return response.json();
    }
};