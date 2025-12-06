using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class TourPackage: BaseEntity
    {

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, 100000)]
        public decimal BasePrice { get; set; }

        public int DurationHours { get; set; } = 2;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
