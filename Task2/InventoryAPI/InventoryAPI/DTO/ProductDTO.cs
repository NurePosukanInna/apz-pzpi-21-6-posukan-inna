namespace InventoryAPI.DTOs
{
    public class ProductDTO
    {
        public string ProductName { get; set; }
        public decimal? Price { get; set; }
        public int? CategoryId { get; set; }
        public int? SupplierId { get; set; }
        public int StoreId { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
    }
}
