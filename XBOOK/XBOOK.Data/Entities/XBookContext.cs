using Microsoft.AspNetCore.Identity;
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
                .ApplyConfiguration(new CompanyProfileConfiguration())
                .ApplyConfiguration(new MoneyReceiptConfiguration());

            //#region Identity Config

            //modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("AppUserClaims").HasKey(x => x.Id);

            //modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("AppRoleClaims")
            //    .HasKey(x => x.Id);

            //modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("AppUserLogins").HasKey(x => x.UserId);

            //modelBuilder.Entity<IdentityUserRole<int>>().ToTable("AppUserRoles")
            //    .HasKey(x => new { x.RoleId, x.UserId });

            //modelBuilder.Entity<IdentityUserToken<int>>().ToTable("AppUserTokens")
            //   .HasKey(x => new { x.UserId });

            //#endregion Identity Config
            base.OnModelCreating(modelBuilder);
        }
    }
}
