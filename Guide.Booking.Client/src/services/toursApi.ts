import api from './apiClient';
import type { TourPackageDto, ExtraDto, PriceCalculationDto, PriceBreakdownDto } from '../types';

export const toursAPI = {
  getAllTours: async (): Promise<TourPackageDto[]> => {
    const response = await api.get('/tours');
    return response.data;
  },

  getTourById: async (id: number): Promise<TourPackageDto> => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  getAllExtras: async (): Promise<ExtraDto[]> => {
    const response = await api.get('/tours/extras');
    return response.data;
  },

  calculatePrice: async (calculation: PriceCalculationDto): Promise<PriceBreakdownDto> => {
    const response = await api.post('/tours/calculate-price', calculation);
    return response.data;
  },
};
