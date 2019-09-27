using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class SaleInvoiceConfiguration : IEntityTypeConfiguration<SaleInvoice>
    {
        public void Configure(EntityTypeBuilder<SaleInvoice> builder)
        {
            builder.Property(e => e.invoiceID).ValueGeneratedOnAdd();
        }
    }
}
