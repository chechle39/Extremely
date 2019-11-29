using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace XBOOK.Data.DataBase
{
    public partial class XBOOKContext : DbContext
    {
        public XBOOKContext()
        {
        }

        public XBOOKContext(DbContextOptions<XBOOKContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AccountChart> AccountChart { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<Client> Client { get; set; }
        public virtual DbSet<CompanyProfile> CompanyProfile { get; set; }
        public virtual DbSet<EntryPattern> EntryPattern { get; set; }
        public virtual DbSet<GeneralLedger> GeneralLedger { get; set; }
        public virtual DbSet<JournalDetail> JournalDetail { get; set; }
        public virtual DbSet<JournalEntry> JournalEntry { get; set; }
        public virtual DbSet<Payments> Payments { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<SaleInvDetail> SaleInvDetail { get; set; }
        public virtual DbSet<SaleInvoice> SaleInvoice { get; set; }
        public virtual DbSet<Tax> Tax { get; set; }
        public virtual DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=HP;Initial Catalog=X-BOOK;Integrated Security=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<AccountChart>(entity =>
            {
                entity.HasKey(e => e.AccountNumber)
                    .HasName("PK_AcountChart");

                entity.Property(e => e.AccountNumber)
                    .HasColumnName("accountNumber")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.AccountName)
                    .IsRequired()
                    .HasColumnName("accountName")
                    .HasMaxLength(100);

                entity.Property(e => e.AccountType)
                    .IsRequired()
                    .HasColumnName("accountType")
                    .HasMaxLength(50);

                entity.Property(e => e.ClosingBalance)
                    .HasColumnName("closingBalance")
                    .HasColumnType("decimal(18, 4)")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.IsParent).HasColumnName("isParent");

                entity.Property(e => e.OpeningBalance)
                    .HasColumnName("openingBalance")
                    .HasColumnType("decimal(18, 4)")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.ParentAccount)
                    .HasColumnName("parentAccount")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.Property(e => e.ClientId).HasColumnName("clientID");

                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .HasMaxLength(200);

                entity.Property(e => e.ClientName)
                    .IsRequired()
                    .HasColumnName("clientName")
                    .HasMaxLength(100);

                entity.Property(e => e.ContactName)
                    .HasColumnName("contactName")
                    .HasMaxLength(200);

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(200);

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);

                entity.Property(e => e.Tag).HasMaxLength(50);

                entity.Property(e => e.TaxCode)
                    .HasColumnName("taxCode")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CompanyProfile>(entity =>
            {
                entity.ToTable("companyProfile");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasColumnName("address")
                    .HasMaxLength(200);

                entity.Property(e => e.BizPhone)
                    .HasColumnName("bizPhone")
                    .HasMaxLength(100);

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasColumnName("city")
                    .HasMaxLength(100);

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasColumnName("companyName")
                    .HasMaxLength(100);

                entity.Property(e => e.Country)
                    .IsRequired()
                    .HasColumnName("country")
                    .HasMaxLength(100);

                entity.Property(e => e.Currency)
                    .HasColumnName("currency")
                    .HasMaxLength(100);

                entity.Property(e => e.DateFormat)
                    .HasColumnName("dateFormat")
                    .HasMaxLength(100);

                entity.Property(e => e.DirectorName)
                    .HasColumnName("directorName")
                    .HasMaxLength(100);

                entity.Property(e => e.LogoFilePath)
                    .HasColumnName("logoFilePath")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.MobilePhone)
                    .HasColumnName("mobilePhone")
                    .HasMaxLength(100);

                entity.Property(e => e.TaxCode)
                    .HasColumnName("taxCode")
                    .HasMaxLength(50);

                entity.Property(e => e.ZipCode)
                    .HasColumnName("zipCode")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<EntryPattern>(entity =>
            {
                entity.HasKey(e => e.PatternId);

                entity.Property(e => e.PatternId).HasColumnName("patternID");

                entity.Property(e => e.AccNumber)
                    .IsRequired()
                    .HasColumnName("accNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.CrspAccNumber)
                    .IsRequired()
                    .HasColumnName("crspAccNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.EntryType)
                    .IsRequired()
                    .HasColumnName("entryType")
                    .HasMaxLength(100);

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);

                entity.Property(e => e.TransactionType)
                    .IsRequired()
                    .HasColumnName("transactionType")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<GeneralLedger>(entity =>
            {
                entity.HasKey(e => e.LedgerId);

                entity.Property(e => e.LedgerId).HasColumnName("ledgerID");

                entity.Property(e => e.AccNumber)
                    .IsRequired()
                    .HasColumnName("accNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.ClientId)
                    .HasColumnName("clientID")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ClientName)
                    .HasColumnName("clientName")
                    .HasMaxLength(200);

                entity.Property(e => e.Credit)
                    .HasColumnName("credit")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.CrspAccNumber)
                    .IsRequired()
                    .HasColumnName("crspAccNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.DateIssue)
                    .HasColumnName("dateIssue")
                    .HasColumnType("datetime");

                entity.Property(e => e.Debit)
                    .HasColumnName("debit")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);

                entity.Property(e => e.Reference)
                    .HasColumnName("reference")
                    .HasMaxLength(200);

                entity.Property(e => e.TransactionNo)
                    .IsRequired()
                    .HasColumnName("transactionNo")
                    .HasMaxLength(50);

                entity.Property(e => e.TransactionType)
                    .IsRequired()
                    .HasColumnName("transactionType")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<JournalDetail>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AccNumber)
                    .IsRequired()
                    .HasColumnName("accNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.Credit)
                    .HasColumnName("credit")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.CrspAccNumber)
                    .IsRequired()
                    .HasColumnName("crspAccNumber")
                    .HasMaxLength(20);

                entity.Property(e => e.Debit)
                    .HasColumnName("debit")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.JournalId).HasColumnName("JournalID");

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<JournalEntry>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.DateCreate)
                    .HasColumnName("dateCreate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasMaxLength(500);

                entity.Property(e => e.EntryName)
                    .IsRequired()
                    .HasColumnName("entryName")
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<Payments>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.BankAccount)
                    .HasColumnName("bankAccount")
                    .HasMaxLength(300);

                entity.Property(e => e.InvoiceId).HasColumnName("invoiceID");

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);

                entity.Property(e => e.PayDate)
                    .HasColumnName("payDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.PayType)
                    .IsRequired()
                    .HasColumnName("payType")
                    .HasMaxLength(100);

                entity.Property(e => e.PayTypeId).HasColumnName("payTypeID");

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.InvoiceId)
                    .HasConstraintName("FK_Payments_SaleInvoice1");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.ProductId).HasColumnName("productID");

                entity.Property(e => e.CategoryId).HasColumnName("categoryID");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasMaxLength(100);

                entity.Property(e => e.ProductName)
                    .HasColumnName("productName")
                    .HasMaxLength(100);

                entity.Property(e => e.UnitPrice)
                    .HasColumnName("unitPrice")
                    .HasColumnType("decimal(18, 4)");
            });

            modelBuilder.Entity<SaleInvDetail>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Amount)
                    .HasColumnName("amount")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .HasMaxLength(100);

                entity.Property(e => e.InvoiceId).HasColumnName("invoiceID");

                entity.Property(e => e.Price)
                    .HasColumnName("price")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.ProductId).HasColumnName("productID");

                entity.Property(e => e.ProductName)
                    .HasColumnName("productName")
                    .HasMaxLength(100);

                entity.Property(e => e.Qty)
                    .HasColumnName("qty")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Vat)
                    .HasColumnName("vat")
                    .HasColumnType("decimal(4, 2)");

                entity.HasOne(d => d.Invoice)
                    .WithMany(p => p.SaleInvDetail)
                    .HasForeignKey(d => d.InvoiceId)
                    .HasConstraintName("FK_SaleInvDetail_SaleInvoice");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.SaleInvDetail)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SaleInvDetail_Product");
            });

            modelBuilder.Entity<SaleInvoice>(entity =>
            {
                entity.HasKey(e => e.InvoiceId)
                    .HasName("PK_saleInvoice");

                entity.Property(e => e.InvoiceId).HasColumnName("invoiceID");

                entity.Property(e => e.AmountPaid)
                    .HasColumnName("amountPaid")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.ClientId).HasColumnName("clientID");

                entity.Property(e => e.DiscRate)
                    .HasColumnName("discRate")
                    .HasColumnType("decimal(4, 2)");

                entity.Property(e => e.Discount)
                    .HasColumnName("discount")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.DueDate)
                    .HasColumnName("dueDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.InvoiceNumber)
                    .IsRequired()
                    .HasColumnName("invoiceNumber")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.InvoiceSerial)
                    .IsRequired()
                    .HasColumnName("invoiceSerial")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IssueDate)
                    .HasColumnName("issueDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Note)
                    .HasColumnName("note")
                    .HasMaxLength(200);

                entity.Property(e => e.Reference)
                    .HasColumnName("reference")
                    .HasMaxLength(100);

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasMaxLength(50);

                entity.Property(e => e.SubTotal)
                    .HasColumnName("subTotal")
                    .HasColumnType("decimal(18, 4)");

                entity.Property(e => e.Term)
                    .HasColumnName("term")
                    .HasMaxLength(200);

                entity.Property(e => e.VatTax)
                    .HasColumnName("vatTax")
                    .HasColumnType("decimal(18, 4)");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.SaleInvoice)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_SaleInvoice_Customer");
            });

            modelBuilder.Entity<Tax>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.TaxName)
                    .HasColumnName("taxName")
                    .HasMaxLength(50);

                entity.Property(e => e.TaxRate)
                    .HasColumnName("taxRate")
                    .HasColumnType("decimal(4, 2)");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FristName).HasMaxLength(60);

                entity.Property(e => e.LastName).HasMaxLength(60);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Token)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
