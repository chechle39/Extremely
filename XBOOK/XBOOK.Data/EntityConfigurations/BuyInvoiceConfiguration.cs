using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class BuyInvoiceConfiguration : IEntityTypeConfiguration<BuyInvoice>
    {
        public void Configure(EntityTypeBuilder<BuyInvoice> builder)
        {
            builder.Property(e => e.invoiceID).ValueGeneratedOnAdd();
        }
    }
}
