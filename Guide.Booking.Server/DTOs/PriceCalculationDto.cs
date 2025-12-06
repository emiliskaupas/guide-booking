namespace Backend.DTOs
{
    public class PriceCalculationDto
    {
        public int TourPackageId { get; set; }
        public int NumberOfPeople { get; set; }
        public List<int> ExtraIds { get; set; } = new();
        public List<TicketCategoryDto> TicketCategories { get; set; } = new();
    }

    public class PriceBreakdownDto
    {
        public decimal BaseTourPrice { get; set; }
        public decimal ExtrasTotal { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalPrice { get; set; }
        public string DiscountReason { get; set; } = string.Empty;
    }
}
