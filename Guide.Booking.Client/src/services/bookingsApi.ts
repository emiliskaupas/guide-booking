import api from './apiClient';
import type { BookingDto, BookingFormDto, BookingFilterDto } from '../types';

export const bookingsAPI = {
  getAllBookings: async (filters?: BookingFilterDto): Promise<BookingDto[]> => {
    const params = new URLSearchParams();
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);
    if (filters?.tourPackageId) params.append('tourPackageId', filters.tourPackageId.toString());
    if (filters?.minGroupSize) params.append('minGroupSize', filters.minGroupSize.toString());
    if (filters?.maxGroupSize) params.append('maxGroupSize', filters.maxGroupSize.toString());
    
    const response = await api.get(`/bookings${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  },

  getBookingById: async (id: number): Promise<BookingDto> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (booking: BookingFormDto): Promise<BookingDto> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  deleteBooking: async (id: number): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};
