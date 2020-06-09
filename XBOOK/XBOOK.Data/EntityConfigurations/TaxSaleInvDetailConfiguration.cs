using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class TaxSaleInvDetailConfiguration : IEntityTypeConfiguration<TaxSaleInvDetail>
    {
        public void Configure(EntityTypeBuilder<TaxSaleInvDetail> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}
