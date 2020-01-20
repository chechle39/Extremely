using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class BuyInvDetailConfiguration : IEntityTypeConfiguration<BuyInvDetail>
    {
        public void Configure(EntityTypeBuilder<BuyInvDetail> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}
