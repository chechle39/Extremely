using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class AccountChartConfiguration : IEntityTypeConfiguration<AccountChart>
    {
        public void Configure(EntityTypeBuilder<AccountChart> builder)
        {
            builder.Property(e => e.accountNumber).ValueGeneratedNever();
        }
    }
}
