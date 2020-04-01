using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.EntitiesDBCommon;

namespace XBOOK.Data.EntityConfigurations
{
    internal class AppUserCommonConfiguration : IEntityTypeConfiguration<AppUserCommon>
    {
        public void Configure(EntityTypeBuilder<AppUserCommon> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}