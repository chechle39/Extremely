using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class JournalDetailConfiguration : IEntityTypeConfiguration<JournalDetail>
    {
        public void Configure(EntityTypeBuilder<JournalDetail> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}
