import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import type { BookingDto } from '../types';

export const useBookingById = (id: number | string | undefined) => {
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingsAPI.getBookingById(Number(id));
        setBooking(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return { booking, loading, error };
};
