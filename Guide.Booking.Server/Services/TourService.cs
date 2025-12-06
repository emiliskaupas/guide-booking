using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class TourService : ITourService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TourService> _logger;

        public TourService(ApplicationDbContext context, ILogger<TourService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<TourPackageDto>> GetAllToursAsync()
        {
            var tours = await _context.TourPackages.ToListAsync();
            return tours.Select(t => new TourPackageDto
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                BasePrice = t.BasePrice,
                DurationHours = t.DurationHours
            });
        }

        public async Task<TourPackageDto?> GetTourByIdAsync(int id)
        {
            var tour = await _context.TourPackages.FindAsync(id);
            if (tour == null) return null;

            return new TourPackageDto
            {
                Id = tour.Id,
                Name = tour.Name,
                Description = tour.Description,
                BasePrice = tour.BasePrice,
                DurationHours = tour.DurationHours
            };
        }

        public async Task<IEnumerable<ExtraDto>> GetAllExtrasAsync()
        {
            var extras = await _context.Extras.ToListAsync();
            return extras.Select(e => new ExtraDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                Price = e.Price
            });
        }

        public async Task<PriceBreakdownDto> CalculatePriceAsync(PriceCalculationDto calculation)
        {
            var tour = await _context.TourPackages.FindAsync(calculation.TourPackageId);
            if (tour == null)
                throw new ArgumentException("Tour package not found");

            decimal baseTourPrice = 0;

            if (calculation.TicketCategories.Any())
            {
                foreach (var category in calculation.TicketCategories)
                {
                    var ticketType = Enum.Parse<TicketType>(category.Type);
                    var discount = ticketType switch
                    {
                        TicketType.Adult => 0m,
                        TicketType.Youth => 0.25m,
                        TicketType.Child => 0.50m,
                        _ => 0m
                    };

                    baseTourPrice += tour.BasePrice * (1 - discount) * category.Quantity;
                }
            }
            else
            {
                // Default calculation without ticket categories
                baseTourPrice = tour.BasePrice * calculation.NumberOfPeople;
            }

            // Apply group discount (4+ people get 20% off base price)
            decimal discountAmount = 0;
            string discountReason = string.Empty;

            if (calculation.NumberOfPeople >= 4)
            {
                discountAmount = baseTourPrice * 0.20m;
                baseTourPrice -= discountAmount;
                discountReason = "20% group discount (4+ people)";
            }

            // Calculate extras total (flat price, no discount)
            decimal extrasTotal = 0;
            if (calculation.ExtraIds.Any())
            {
                var extras = await _context.Extras
                    .Where(e => calculation.ExtraIds.Contains(e.Id))
                    .ToListAsync();

                extrasTotal = extras.Sum(e => e.Price);
            }

            return new PriceBreakdownDto
            {
                BaseTourPrice = baseTourPrice,
                ExtrasTotal = extrasTotal,
                DiscountAmount = discountAmount,
                TotalPrice = baseTourPrice + extrasTotal,
                DiscountReason = discountReason
            };
        }
    }
}
