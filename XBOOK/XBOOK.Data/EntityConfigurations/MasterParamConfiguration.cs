using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class MasterParamConfiguration : IEntityTypeConfiguration<MasterParam>
    {
        public void Configure(EntityTypeBuilder<MasterParam> builder)
        {
            builder.HasKey(e => new { e.key, e.paramType });
        }
    }
}
