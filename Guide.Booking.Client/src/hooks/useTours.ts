import { useState, useEffect } from 'react';
import { toursAPI } from '../services/api';
import type { TourPackageDto, ExtraDto, PriceCalculationDto, PriceBreakdownDto } from '../types';

export const useTours = () => {
  const [tours, setTours] = useState<TourPackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await toursAPI.getAllTours();
        setTours(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tours');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return { tours, loading, error };
};

export const useExtras = () => {
  const [extras, setExtras] = useState<ExtraDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        setLoading(true);
        const data = await toursAPI.getAllExtras();
        setExtras(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch extras');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtras();
  }, []);

  return { extras, loading, error };
};

export const usePriceCalculation = () => {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdownDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = async (calculation: PriceCalculationDto) => {
    try {
      setLoading(true);
      const data = await toursAPI.calculatePrice(calculation);
      setPriceBreakdown(data);
      setError(null);
    } catch (err) {
      setError('Failed to calculate price');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { priceBreakdown, calculatePrice, loading, error };
};
