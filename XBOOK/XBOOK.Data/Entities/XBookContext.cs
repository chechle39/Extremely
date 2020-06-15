using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.EntityConfigurations;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Entities
{
    public class XBookContext : IdentityDbContext<AppUser, AppRole, int>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly IConfiguration _configuration;
        private readonly IUserCommonRepository _userCommonRepository;
        private readonly IMemoryCache _cache;
        public XBookContext(DbContextOptions<XBookContext> options, IMemoryCache cache, IUserCommonRepository userCommonRepository, IHttpContextAccessor httpContextAccessor, IConfiguration configuration) : base(options)
        {
            _userCommonRepository = userCommonRepository;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _cache = cache;
        }
        public DbSet<AccountChart> AccountChart { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<Client> Client { get; set; }
        public DbSet<GeneralLedger> GeneralLedger { get; set; }
        public DbSet<JournalDetail> JournalDetail { get; set; }
        public DbSet<JournalEntry> JournalEntry { get; set; }
        public DbSet<Payments> Payments { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<SaleInvoice> SaleInvoice { get; set; }

        public DbSet<SaleInvDetail> SaleInvDetail { get; set; }
        public DbSet<EntryPattern> EntryPattern { get; set; }
        public DbSet<Tax> Tax { get; set; }
        public DbSet<CompanyProfile> CompanyProfile { get; set; }
        public DbSet<MoneyReceipt> MoneyReceipt { get; set; }
        public DbSet<Supplier> Supplier { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipt { get; set; }
        public DbSet<Payments_2> Payments_2 { get; set; }
        public DbSet<BuyInvoice> BuyInvoice { get; set; }
        public DbSet<BuyInvDetail> BuyInvDetail { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<AppRole> AppRoles { get; set; }
        public DbSet<Functions> Functions { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public virtual DbSet<TaxSaleInvDetail> TaxSaleInvDetail { get; set; }
        public virtual DbSet<TaxSaleInvoice> TaxSaleInvoice { get; set; }
        public virtual DbSet<Invoice_TaxInvoice> Invoice_TaxInvoice { get; set; }
        public virtual DbSet<TaxBuyInvDetail> TaxBuyInvDetail { get; set; }
        public virtual DbSet<TaxBuyInvoice> TaxBuyInvoice { get; set; }
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
                .ApplyConfiguration(new TaxSaleInvDetailConfiguration())
                .ApplyConfiguration(new TaxSaleInvoiceConfiguration())
                .ApplyConfiguration(new EntryPatternConfiguration())
                .ApplyConfiguration(new TaxConfiguration())
                .ApplyConfiguration(new MasterParamConfiguration())
                .ApplyConfiguration(new CompanyProfileConfiguration())
                .ApplyConfiguration(new MoneyReceiptConfiguration())
                .ApplyConfiguration(new SupplierConfiguration())
                .ApplyConfiguration(new PaymentReceiptConfiguration())
                .ApplyConfiguration(new Payments_2Configuration())
                .ApplyConfiguration(new BuyInvoiceConfiguration())
                .ApplyConfiguration(new FunctionsConfiguration())
                .ApplyConfiguration(new PermissionConfiguration())
                .ApplyConfiguration(new Invoice_TaxInvoiceConfiguration())
                .ApplyConfiguration(new TaxBuyInvDetailConfiguration())
                .ApplyConfiguration(new TaxBuyInvoiceConfiguration())
                .ApplyConfiguration(new BuyInvDetailConfiguration());

            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("AppUserClaims").HasKey(x => x.Id);

            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("AppRoleClaims")
                .HasKey(x => x.Id);

            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("AppUserLogins").HasKey(x => x.UserId);

            modelBuilder.Entity<IdentityUserRole<int>>().ToTable("AppUserRoles")
                .HasKey(x => new { x.UserId, x.RoleId });

            modelBuilder.Entity<IdentityUserToken<int>>().ToTable("AppUserTokens")
               .HasKey(x => new { x.UserId });
            
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (_httpContextAccessor.HttpContext != null)
            {
                var email = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].ToString().Split("Bearer");
                if (_httpContextAccessor.HttpContext.User.Claims.ToList().Count > 0)
                {
                    string codeKey;
                    var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
                    if (_cache.TryGetValue(CacheKey.UserCompany.UseCommon + code, out AppUserCommon cacheData))
                    {
                        codeKey = cacheData.ConnectionString;
                    }
                    else
                    {
                        var mail = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
                        var userCommon = _userCommonRepository.FindUserCommon(mail).Result;
                        codeKey = userCommon.ConnectionString;
                        _cache.Set(CacheKey.UserCompany.UseCommon + code, userCommon);
                        //codeKey = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").ToList()[0].Value;
                    }
                    optionsBuilder.UseSqlServer(codeKey);
                }
                else
                {
                    if (email.ToList().Count() > 1)
                    {
                        if ("" != email[1].Substring(1))
                        {
                            var code = _userCommonRepository.FindUserCommon(email[1].Substring(1)).Result;
                            if (code != null)
                            {
                                var connectionString = _configuration.GetConnectionString(code.Code);
                                optionsBuilder.UseSqlServer(code.ConnectionString);
                            }
                        }
                    }



                }

            }
            //  var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            //  var codeKey = (AppUserCommon)_cache.Get(CacheKey.UserCompany.UseCommon + code);
            ////  var connectionString = _configuration.GetConnectionString("DefaultConnection");
            //  optionsBuilder.UseSqlServer(codeKey.ConnectionString);
        }
        public override int SaveChanges()
        {
            var modified = ChangeTracker.Entries().Where(e => e.State == EntityState.Modified || e.State == EntityState.Added);

            foreach (EntityEntry item in modified)
            {
                var changedOrAddedItem = item.Entity as IDateTracking;
                if (changedOrAddedItem != null)
                {
                    if (item.State == EntityState.Added)
                    {
                        changedOrAddedItem.DateCreated = DateTime.Now;
                    }
                    changedOrAddedItem.DateModified = DateTime.Now;
                }
            }
            return base.SaveChanges();
        }
    }
}