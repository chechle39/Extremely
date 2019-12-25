using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    class MoneyReceiptConfiguration: IEntityTypeConfiguration<MoneyReceipt>
    {
        public void Configure(EntityTypeBuilder<MoneyReceipt> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}
