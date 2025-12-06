using Backend.DTOs;

namespace Backend.Services
{
    public interface ITourService
    {
        Task<IEnumerable<TourPackageDto>> GetAllToursAsync();
        Task<TourPackageDto?> GetTourByIdAsync(int id);
        Task<IEnumerable<ExtraDto>> GetAllExtrasAsync();
        Task<PriceBreakdownDto> CalculatePriceAsync(PriceCalculationDto calculation);
    }
}
