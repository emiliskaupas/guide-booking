export interface TourPackageDto {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  durationHours: number;
}

export interface ExtraDto {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface PriceCalculationDto {
  tourPackageId: number;
  numberOfPeople: number;
  extraIds?: number[];
  ticketCategories?: TicketCategoryDto[];
}

export interface PriceBreakdownDto {
  baseTourPrice: number;
  extrasTotal: number;
  discountAmount: number;
  totalPrice: number;
  discountReason: string;
}

export interface TicketCategoryDto {
  type: 'Adult' | 'Youth' | 'Child';
  quantity: number;
}
