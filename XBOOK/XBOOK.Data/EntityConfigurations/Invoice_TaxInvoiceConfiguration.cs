using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Entities;

namespace XBOOK.Data.EntityConfigurations
{
    internal class Invoice_TaxInvoiceConfiguration : IEntityTypeConfiguration<Invoice_TaxInvoice>
    {
        public void Configure(EntityTypeBuilder<Invoice_TaxInvoice> builder)
        {
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
        }
    }
}