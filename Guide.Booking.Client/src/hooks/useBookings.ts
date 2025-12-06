import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import type { BookingDto, BookingFormDto, BookingFilterDto } from '../types';

export const useBookings = (filters?: BookingFilterDto) => {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getAllBookings(filters);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters?.fromDate, filters?.toDate, filters?.tourPackageId, filters?.minGroupSize, filters?.maxGroupSize]);

  const createBooking = async (booking: BookingFormDto) => {
    try {
      const newBooking = await bookingsAPI.createBooking(booking);
      setBookings([...bookings, newBooking]);
      return newBooking;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      await bookingsAPI.deleteBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  return { bookings, loading, error, createBooking, deleteBooking, refetch: fetchBookings };
};
