using Microsoft.EntityFrameworkCore;
using XBOOK.Data.EntityConfigurations;

namespace XBOOK.Data.Entities
{
    public class XBookContext : DbContext
#pragma warning restore S101 // Types should be named in PascalCase
    {
        public XBookContext(DbContextOptions<XBookContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AccountChartConfiguration())
                .ApplyConfiguration(new CategoryConfiguration())
                .ApplyConfiguration(new ClientConfiguration())
                .ApplyConfiguration(new GeneralLedgerConfiguration())
                .ApplyConfiguration(new JournalDetailConfiguration())
                .ApplyConfiguration(new JournalEntryConfiguration())
                .ApplyConfiguration(new PaymentConfiguration())
                .ApplyConfiguration(new ProductConfiguration())
                .ApplyConfiguration(new SaleInvDetailConfiguration())
                .ApplyConfiguration(new SaleInvoiceConfiguration())
                .ApplyConfiguration(new TaxConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
