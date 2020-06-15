using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class TaxBuyInvoiceConfiguration : IEntityTypeConfiguration<TaxBuyInvoice>
    {
        public void Configure(EntityTypeBuilder<TaxBuyInvoice> builder)
        {
            builder.Property(e => e.invoiceID).ValueGeneratedOnAdd();
        }
    }
}