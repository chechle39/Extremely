namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Product
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Product()
        {
            this.SaleInvDetails = new HashSet<SaleInvDetail>();
        }

        public Product(int? categoryID, int productID, string productName, decimal? unitPrice, string description)
        {
            this.categoryID = categoryID;
            this.productID = productID;
            this.productName = productName;
            this.unitPrice = unitPrice;
            this.description = description;
        }

        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> unitPrice { get; set; }
        public Nullable<int> categoryID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleInvDetail> SaleInvDetails { get; set; }
    }
}
