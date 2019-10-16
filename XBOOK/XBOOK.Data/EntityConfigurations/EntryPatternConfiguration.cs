using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class EntryPatternConfiguration : IEntityTypeConfiguration<EntryPattern>
    {
        public void Configure(EntityTypeBuilder<EntryPattern> builder)
        {
            builder.Property(e => e.patternID).ValueGeneratedOnAdd();
        }
    }
}
