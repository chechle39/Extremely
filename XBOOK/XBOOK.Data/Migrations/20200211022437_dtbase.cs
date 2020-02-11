using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace XBOOK.Data.Migrations
{
    public partial class dtbase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountChart",
                columns: table => new
                {
                    accountNumber = table.Column<string>(nullable: false),
                    accountName = table.Column<string>(nullable: true),
                    accountType = table.Column<string>(nullable: true),
                    isParent = table.Column<bool>(nullable: false),
                    parentAccount = table.Column<string>(nullable: true),
                    openingBalance = table.Column<decimal>(nullable: true),
                    closingBalance = table.Column<decimal>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountChart", x => x.accountNumber);
                });

            migrationBuilder.CreateTable(
                name: "AppRoles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Description = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    BirthDay = table.Column<DateTime>(nullable: true),
                    Balance = table.Column<decimal>(nullable: false),
                    Avatar = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateModified = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategoryID = table.Column<int>(nullable: false),
                    CategoryName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    clientID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    clientName = table.Column<string>(nullable: true),
                    address = table.Column<string>(nullable: true),
                    taxCode = table.Column<string>(nullable: true),
                    Tag = table.Column<string>(nullable: true),
                    contactName = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    bankAccount = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client", x => x.clientID);
                });

            migrationBuilder.CreateTable(
                name: "CompanyProfile",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    companyName = table.Column<string>(nullable: true),
                    address = table.Column<string>(nullable: true),
                    city = table.Column<string>(nullable: true),
                    country = table.Column<string>(nullable: true),
                    zipCode = table.Column<string>(nullable: true),
                    currency = table.Column<string>(nullable: true),
                    dateFormat = table.Column<string>(nullable: true),
                    bizPhone = table.Column<string>(nullable: true),
                    mobilePhone = table.Column<string>(nullable: true),
                    directorName = table.Column<string>(nullable: true),
                    logoFilePath = table.Column<string>(nullable: true),
                    taxCode = table.Column<string>(nullable: true),
                    bankAccount = table.Column<string>(nullable: true),
                    code = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EntryPattern",
                columns: table => new
                {
                    patternID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    transactionType = table.Column<string>(nullable: true),
                    entryType = table.Column<string>(nullable: true),
                    accNumber = table.Column<string>(nullable: true),
                    crspAccNumber = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntryPattern", x => x.patternID);
                });

            migrationBuilder.CreateTable(
                name: "GeneralLedger",
                columns: table => new
                {
                    ledgerID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    transactionType = table.Column<string>(nullable: true),
                    transactionNo = table.Column<string>(nullable: true),
                    accNumber = table.Column<string>(nullable: true),
                    crspAccNumber = table.Column<string>(nullable: true),
                    dateIssue = table.Column<DateTime>(nullable: false),
                    clientID = table.Column<string>(nullable: true),
                    clientName = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    reference = table.Column<string>(nullable: true),
                    debit = table.Column<decimal>(nullable: false),
                    credit = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneralLedger", x => x.ledgerID);
                });

            migrationBuilder.CreateTable(
                name: "JournalDetail",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    JournalID = table.Column<long>(nullable: false),
                    accNumber = table.Column<string>(nullable: true),
                    crspAccNumber = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    debit = table.Column<decimal>(nullable: false),
                    credit = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JournalDetail", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "JournalEntry",
                columns: table => new
                {
                    JournalID = table.Column<long>(nullable: false),
                    accountNumber = table.Column<string>(nullable: true),
                    debitAmount = table.Column<decimal>(nullable: false),
                    creditAmount = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JournalEntry", x => x.JournalID);
                });

            migrationBuilder.CreateTable(
                name: "MoneyReceipt",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    receiptNumber = table.Column<string>(nullable: true),
                    entryType = table.Column<string>(nullable: true),
                    clientID = table.Column<long>(nullable: true),
                    clientName = table.Column<string>(nullable: true),
                    receiverName = table.Column<string>(nullable: true),
                    payDate = table.Column<DateTime>(nullable: false),
                    payTypeID = table.Column<int>(nullable: false),
                    payType = table.Column<string>(nullable: true),
                    bankAccount = table.Column<string>(nullable: true),
                    amount = table.Column<decimal>(nullable: false),
                    note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoneyReceipt", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "PaymentReceipt",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    receiptNumber = table.Column<string>(nullable: true),
                    entryType = table.Column<string>(nullable: true),
                    supplierID = table.Column<long>(nullable: true),
                    supplierName = table.Column<string>(nullable: true),
                    receiverName = table.Column<string>(nullable: true),
                    payDate = table.Column<DateTime>(nullable: false),
                    payTypeID = table.Column<int>(nullable: false),
                    payType = table.Column<string>(nullable: true),
                    bankAccount = table.Column<string>(nullable: true),
                    amount = table.Column<decimal>(nullable: false),
                    note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentReceipt", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    productID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    productName = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    unitPrice = table.Column<decimal>(nullable: true),
                    categoryID = table.Column<int>(nullable: true),
                    Unit = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.productID);
                });

            migrationBuilder.CreateTable(
                name: "Supplier",
                columns: table => new
                {
                    supplierID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    supplierName = table.Column<string>(nullable: true),
                    address = table.Column<string>(nullable: true),
                    taxCode = table.Column<string>(nullable: true),
                    Tag = table.Column<string>(nullable: true),
                    contactName = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    bankAccount = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier", x => x.supplierID);
                });

            migrationBuilder.CreateTable(
                name: "Tax",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    taxName = table.Column<string>(nullable: true),
                    taxRate = table.Column<decimal>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tax", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AppRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppRoleClaims_AppRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AppRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppUserClaims_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.UniqueConstraint("AK_AppUserLogins_UserId", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_AppUserLogins_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserRoles", x => new { x.UserId, x.RoleId });
                    table.UniqueConstraint("AK_AppUserRoles_RoleId_UserId", x => new { x.RoleId, x.UserId });
                    table.ForeignKey(
                        name: "FK_AppUserRoles_AppRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AppRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserRoles_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.UniqueConstraint("AK_AppUserTokens_UserId", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_AppUserTokens_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SaleInvoice",
                columns: table => new
                {
                    invoiceID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceSerial = table.Column<string>(nullable: true),
                    invoiceNumber = table.Column<string>(nullable: true),
                    issueDate = table.Column<DateTime>(nullable: true),
                    dueDate = table.Column<DateTime>(nullable: true),
                    clientID = table.Column<int>(nullable: true),
                    reference = table.Column<string>(nullable: true),
                    subTotal = table.Column<decimal>(nullable: true),
                    discRate = table.Column<decimal>(nullable: true),
                    discount = table.Column<decimal>(nullable: true),
                    vatTax = table.Column<decimal>(nullable: true),
                    amountPaid = table.Column<decimal>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    term = table.Column<string>(nullable: true),
                    status = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleInvoice", x => x.invoiceID);
                    table.ForeignKey(
                        name: "FK_SaleInvoice_Client_clientID",
                        column: x => x.clientID,
                        principalTable: "Client",
                        principalColumn: "clientID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuyInvoice",
                columns: table => new
                {
                    invoiceID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceSerial = table.Column<string>(nullable: true),
                    invoiceNumber = table.Column<string>(nullable: true),
                    issueDate = table.Column<DateTime>(nullable: true),
                    dueDate = table.Column<DateTime>(nullable: true),
                    supplierID = table.Column<int>(nullable: true),
                    reference = table.Column<string>(nullable: true),
                    subTotal = table.Column<decimal>(nullable: true),
                    discRate = table.Column<decimal>(nullable: true),
                    discount = table.Column<decimal>(nullable: true),
                    vatTax = table.Column<decimal>(nullable: true),
                    amountPaid = table.Column<decimal>(nullable: true),
                    note = table.Column<string>(nullable: true),
                    term = table.Column<string>(nullable: true),
                    status = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyInvoice", x => x.invoiceID);
                    table.ForeignKey(
                        name: "FK_BuyInvoice_Supplier_supplierID",
                        column: x => x.supplierID,
                        principalTable: "Supplier",
                        principalColumn: "supplierID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceID = table.Column<long>(nullable: false),
                    payDate = table.Column<DateTime>(nullable: false),
                    payTypeID = table.Column<int>(nullable: false),
                    payType = table.Column<string>(nullable: true),
                    receiptNumber = table.Column<string>(nullable: true),
                    amount = table.Column<decimal>(nullable: false),
                    note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Payments_SaleInvoice_invoiceID",
                        column: x => x.invoiceID,
                        principalTable: "SaleInvoice",
                        principalColumn: "invoiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SaleInvDetail",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceID = table.Column<long>(nullable: false),
                    productID = table.Column<int>(nullable: false),
                    productName = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    qty = table.Column<decimal>(nullable: true),
                    price = table.Column<decimal>(nullable: true),
                    amount = table.Column<decimal>(nullable: true),
                    vat = table.Column<decimal>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleInvDetail", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SaleInvDetail_SaleInvoice_invoiceID",
                        column: x => x.invoiceID,
                        principalTable: "SaleInvoice",
                        principalColumn: "invoiceID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SaleInvDetail_Product_productID",
                        column: x => x.productID,
                        principalTable: "Product",
                        principalColumn: "productID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BuyInvDetail",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceID = table.Column<long>(nullable: false),
                    productID = table.Column<int>(nullable: false),
                    productName = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    qty = table.Column<decimal>(nullable: true),
                    price = table.Column<decimal>(nullable: true),
                    amount = table.Column<decimal>(nullable: true),
                    vat = table.Column<decimal>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyInvDetail", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BuyInvDetail_BuyInvoice_invoiceID",
                        column: x => x.invoiceID,
                        principalTable: "BuyInvoice",
                        principalColumn: "invoiceID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BuyInvDetail_Product_productID",
                        column: x => x.productID,
                        principalTable: "Product",
                        principalColumn: "productID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments_2",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoiceID = table.Column<long>(nullable: false),
                    payDate = table.Column<DateTime>(nullable: false),
                    payTypeID = table.Column<int>(nullable: false),
                    payType = table.Column<string>(nullable: true),
                    amount = table.Column<decimal>(nullable: false),
                    note = table.Column<string>(nullable: true),
                    receiptNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments_2", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Payments_2_BuyInvoice_invoiceID",
                        column: x => x.invoiceID,
                        principalTable: "BuyInvoice",
                        principalColumn: "invoiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppRoleClaims_RoleId",
                table: "AppRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AppRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserClaims_UserId",
                table: "AppUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AppUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AppUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_BuyInvDetail_invoiceID",
                table: "BuyInvDetail",
                column: "invoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_BuyInvDetail_productID",
                table: "BuyInvDetail",
                column: "productID");

            migrationBuilder.CreateIndex(
                name: "IX_BuyInvoice_supplierID",
                table: "BuyInvoice",
                column: "supplierID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_invoiceID",
                table: "Payments",
                column: "invoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_2_invoiceID",
                table: "Payments_2",
                column: "invoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleInvDetail_invoiceID",
                table: "SaleInvDetail",
                column: "invoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleInvDetail_productID",
                table: "SaleInvDetail",
                column: "productID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleInvoice_clientID",
                table: "SaleInvoice",
                column: "clientID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountChart");

            migrationBuilder.DropTable(
                name: "AppRoleClaims");

            migrationBuilder.DropTable(
                name: "AppUserClaims");

            migrationBuilder.DropTable(
                name: "AppUserLogins");

            migrationBuilder.DropTable(
                name: "AppUserRoles");

            migrationBuilder.DropTable(
                name: "AppUserTokens");

            migrationBuilder.DropTable(
                name: "BuyInvDetail");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "CompanyProfile");

            migrationBuilder.DropTable(
                name: "EntryPattern");

            migrationBuilder.DropTable(
                name: "GeneralLedger");

            migrationBuilder.DropTable(
                name: "JournalDetail");

            migrationBuilder.DropTable(
                name: "JournalEntry");

            migrationBuilder.DropTable(
                name: "MoneyReceipt");

            migrationBuilder.DropTable(
                name: "PaymentReceipt");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Payments_2");

            migrationBuilder.DropTable(
                name: "SaleInvDetail");

            migrationBuilder.DropTable(
                name: "Tax");

            migrationBuilder.DropTable(
                name: "AppRoles");

            migrationBuilder.DropTable(
                name: "AppUsers");

            migrationBuilder.DropTable(
                name: "BuyInvoice");

            migrationBuilder.DropTable(
                name: "SaleInvoice");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Supplier");

            migrationBuilder.DropTable(
                name: "Client");
        }
    }
}
