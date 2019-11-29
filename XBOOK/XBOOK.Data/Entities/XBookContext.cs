using Microsoft.EntityFrameworkCore;
using XBOOK.Data.EntityConfigurations;

namespace XBOOK.Data.Entities
{
    public class XBookContext : DbContext
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
                .ApplyConfiguration(new EntryPatternConfiguration())
                .ApplyConfiguration(new TaxConfiguration())
                .ApplyConfiguration(new CompanyProfileConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
