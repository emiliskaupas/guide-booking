import type { TourPackageDto, ExtraDto, TicketCategoryDto } from './tour.dto';

export interface BookingDto {
  id: number;
  customerName: string;
  customerEmail: string;
  tourPackage: TourPackageDto;
  tourDate: string;
  numberOfPeople: number;
  totalPrice: number;
  extras: ExtraDto[];
  ticketCategories: TicketCategoryDto[];
  createdAt: string;
}

export interface BookingFormDto {
  customerName: string;
  customerEmail: string;
  tourPackageId: number;
  tourDate: string;
  numberOfPeople: number;
  extraIds?: number[];
  ticketCategories?: TicketCategoryDto[];
}

export interface BookingFilterDto {
  fromDate?: string;
  toDate?: string;
  tourPackageId?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
}
