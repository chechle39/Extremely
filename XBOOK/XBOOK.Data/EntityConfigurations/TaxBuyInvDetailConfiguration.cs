using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class TaxBuyInvDetailConfiguration : IEntityTypeConfiguration<TaxBuyInvDetail>
    {
        public void Configure(EntityTypeBuilder<TaxBuyInvDetail> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}