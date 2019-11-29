using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class Product
    {
        public Product()
        {
            SaleInvDetail = new HashSet<SaleInvDetail>();
        }

        public Product(int? categoryID, int productID, string productName, decimal? unitPrice, string description)
        {
            CategoryId = categoryID;
            ProductId = productID;
            ProductName = productName;
            UnitPrice = unitPrice;
            Description = description;
        }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal? UnitPrice { get; set; }
        public int? CategoryId { get; set; }

        public virtual ICollection<SaleInvDetail> SaleInvDetail { get; set; }
    }
}
