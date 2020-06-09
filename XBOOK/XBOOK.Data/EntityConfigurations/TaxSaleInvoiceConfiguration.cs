using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class TaxSaleInvoiceConfiguration : IEntityTypeConfiguration<TaxSaleInvoice>
    {
        public void Configure(EntityTypeBuilder<TaxSaleInvoice> builder)
        {
            builder.Property(e => e.taxInvoiceID).ValueGeneratedOnAdd();
        }
    }
}

