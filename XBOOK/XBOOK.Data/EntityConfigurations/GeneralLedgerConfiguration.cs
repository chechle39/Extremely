using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class GeneralLedgerConfiguration : IEntityTypeConfiguration<GeneralLedger>
    {
        public void Configure(EntityTypeBuilder<GeneralLedger> builder)
        {
            builder.Property(e => e.ledgerID).ValueGeneratedOnAdd();
        }
    }
}
