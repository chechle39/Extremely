using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;


namespace XBOOK.Data.EntityConfigurations
{
    internal class SaleInvDetailConfiguration : IEntityTypeConfiguration<SaleInvDetail>
    {
        public void Configure(EntityTypeBuilder<SaleInvDetail> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}
