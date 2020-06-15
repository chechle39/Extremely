﻿using AutoMapper;
using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using DevExpress.Security.Resources;
using DevExpress.XtraReports.Security;
using DevExpress.XtraReports.Web.ClientControls;
using DevExpress.XtraReports.Web.WebDocumentViewer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Net;
using System.Text;
using Xbook.TaxInvoice.Interfaces;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.Service;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.Repositories;
using XBOOK.Service.Interfaces;
using XBOOK.Service.Service;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web
{
    public class Startup
    {
        private const string SecretKey = "iNivDmHLpUA223sqsfhqGbMRdRj1PVkH"; // todo: get this from somewhere secure
        private readonly SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));
        public Startup(IHostingEnvironment env)
        {
            ScriptPermissionManager.GlobalInstance = new ScriptPermissionManager(ExecutionMode.Unrestricted);
            AccessSettings.StaticResources.TrySetRules(DirectoryAccessRule.Allow(@"C:\\uploaded"));
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }
     
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<AppUser, AppRole>()
            .AddDefaultUI()
            .AddEntityFrameworkStores<XBookContext>()
            .AddDefaultTokenProviders();
            services.AddDbContext<XBookContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

            });
            services.AddDbContext<XBookComonContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnectionCommon"));
            });
            services.Configure<DataProtectionTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromMinutes(5)
            );
            services
                .AddMvc()
                .AddDefaultReportingControllers()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
             //   ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],

                ValidateAudience = true,
              //  ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],

                ValidateIssuerSigningKey = true,
               // IssuerSigningKey = _signingKey,

                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };


            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(x =>
            {
                //configureOptions.RequireHttpsMetadata = false;
                //configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                //configureOptions.TokenValidationParameters = tokenValidationParameters;
                //configureOptions.SaveToken = true;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("iNivDmHLpUA223sqsfhqGbMRdRj1PVkH")),//jwtSettings.Secret)),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RequireExpirationTime = false,
                    ValidateLifetime = true
                };
            });

                        services.AddDevExpressControls();
            services.AddScoped<DevExpress.XtraReports.Web.Extensions.ReportStorageWebExtension, XBOOK.Report.Services.ReportStorageWebExtension>();
            DefaultWebDocumentViewerContainer.UseCachedReportSourceBuilder();


            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;

                // User settings
                options.User.RequireUniqueEmail = true;
            });
            services.AddScoped<UserManager<AppUser>, UserManager<AppUser>>();
            services.AddScoped<RoleManager<AppRole>, RoleManager<AppRole>>();
            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins()
                        .AllowCredentials();
                }));


            services.ConfigureReportingServices(configurator => {
                configurator.ConfigureReportDesigner(designerConfigurator => {
                    designerConfigurator.RegisterDataSourceWizardConfigFileConnectionStringsProvider();
                });
                configurator.ConfigureWebDocumentViewer(viewerConfigurator => {
                    viewerConfigurator.UseCachedReportSourceBuilder();
                });
            });

            services.AddAutoMapper();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddSingleton(Mapper.Configuration);
            services.AddScoped<IMapper>(sp => new Mapper(sp.GetRequiredService<AutoMapper.IConfigurationProvider>(), sp.GetService));
            services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            // service
            services.AddTransient<ISaleInvoiceService, SaleInvoiceService>();
            services.AddTransient<IPaymentsService, PaymentsService>();
            services.AddTransient<IClientService, ClientService>();
            services.AddTransient<ISaleInvDetailService, SaleInvDetailService>();
            services.AddTransient<IGeneralLedgerService, GeneralLedgerService>();
            services.AddTransient<ITaxService, TaxService>();
            services.AddTransient<IMasterParamService, MasterParamService>();
            services.AddTransient<IAcountChartService, AccountChartSerVice>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IPaymentReceiptService, PaymentReceiptService>();
            services.AddTransient<ICompanyProfileService, CompanyProfileService>();
            services.AddTransient<IGeneralLedgerGroupService, GeneralLedgerGroupService>();
            services.AddTransient<IMoneyReceiptService, MoneyReceiptService>();
            services.AddTransient<IEntryPatternService, EntryPatternService>();
            services.AddTransient<IBuyInvoiceService, BuyInvoiceService>();
            services.AddTransient<ISupplierService, SupplierService>();
            services.AddTransient<IPayments2Service, Payments2Service>();
            services.AddTransient<IBuyDetailInvoiceService, BuyDetailInvoiceService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IRoleService, RoleService>();
            services.AddTransient<IJournalEntryService, JournalEntryService>();
            services.AddTransient<IJournalDetailService, JournalDetailService>();
            services.AddTransient<IFunctionsService, FunctionsService>();
            services.AddTransient<ICachingService, MemoryCacheService>();
            services.AddTransient<IUserCommonService, UserCommonService>();
            services.AddTransient<ITaxSaleInvoiceService, TaxSaleInvoiceService>();
            services.AddTransient<ITaxInvDetailService, TaxInvDetailService>();
            services.AddTransient<ITaxBuySaleInvoiceService, TaxBuySaleInvoiceService>();
            services.AddTransient<ITaxBuyInvDetailService, TaxBuyInvDetailService>();
            services.AddTransient<ITaxBuyInvDetailRepository, TaxBuyInvDetailRepository>();
            // reponsitory
            services.AddTransient<IPaymentReceiptRepository, PaymentReceiptRepository>();
            services.AddTransient<IClientRepository, ClientRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IPaymentRepository, PaymentRepository>();
            services.AddTransient<ISaleInvoiceRepository, SaleInvoiceRepository>();
            services.AddTransient<ISaleInvoiceDetailRepository, SaleInvoiceDetailRepository>();
            services.AddTransient<ICompanyProfileReponsitory, CompanyProfileReponsitory>();
            services.AddTransient<ITaxRepository, TaxRepository>();
            services.AddTransient<IMasterParamRepository, MasterParamRepository>();
            services.AddTransient<IMoneyReceiptRepository, MoneyReceiptRepository>();
            services.AddTransient<IEntryPatternRepository, EntryPatternRepository>();
            services.AddTransient<IBuyInvoiceRepository, BuyInvoiceRepository>();
            services.AddTransient<ISupplierRepository, SupplierRepository>();
            services.AddTransient<IBuyInvDetailRepository, BuyInvDetailRepository>();
            services.AddTransient<IPayment2Repository, Payment2Repository>();
            services.AddTransient<IAccountChartRepository, AccountChartRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IJournalEntryRepository, JournalEntryRepository>();
            services.AddTransient<IJournalDetailRepository, JournalDetailRepository>();
            services.AddTransient<IUserRolesRepository, UserRolesRepository>();
            services.AddTransient<IFunctionsRepository, FunctionsRepository>();
            services.AddTransient<IUserCommonRepository, UserCommonRepository>();
            services.AddTransient<ITaxSaleInvoiceRepository, TaxSaleInvoiceRepository>();
            services.AddTransient<ITaxInvDetailRepository, TaxInvDetailRepository>();
            services.AddTransient<ITaxBuyInvoiceRepository, TaxBuyInvoiceRepository>();
            services.AddTransient<ITaxBuyInvDetailRepository, TaxBuyInvDetailRepository>();
            // dapper
            services.AddTransient<ISalesReportServiceDapper, SalesReportServiceDapper>();
            services.AddTransient<IDebitageServiceDapper, DebitAgeServiceDapper>();
            services.AddTransient<IMoneyFundServiceDapper, MoneyFundServiceDapper>();
            services.AddTransient<IAccountDetailServiceDapper, AccountDetailServiceDapper>();
            services.AddTransient<IPurchaseReportDapper, PurchaseReportServiceDapper>();
            services.AddTransient<IClientServiceDapper, ClientServiceDapper>();
            services.AddTransient<IAccountBalanceServiceDapper, AccountBalanceServiceDapper>();
            services.AddTransient<IInvoiceServiceDapper, InvoiceServiceDapper>();
            services.AddTransient<IMoneyReceiptDapper, MoneyReceiptServiceDapper>();
            services.AddTransient<IBuyInvoiceServiceDapper, BuyInvoiceServiceDapper>();
            services.AddTransient<ISupplierServiceDapper, SupplierServiceDapper>();
            services.AddTransient<IPaymentReceiptServiceDapper, PaymentReceiptServiceDapper>();
            services.AddTransient<IPermissionDapper, PermissionServiceDapper>();
            services.AddTransient<IDashboardServiceDapper, DashboardServiceDapper>();
            services.AddTransient<ITaxInvoiceServiceDapper, TaxInvoiceServiceDapper>();
            services.AddTransient<ITaxBuyInvoiceServiceDapper, TaxBuyInvoiceServiceDapper>();
            services.AddSingleton<IJwtFactory, JwtFactory>();
            services.AddTransient<DevExpress.XtraReports.Web.Extensions.ReportStorageWebExtension, XBOOK.Report.Services.ReportStorageWebExtension>();
            services.AddScoped<DbContext, XBookContext>();
            services.AddScoped<DbContext, XBookComonContext>();
            services.TryAddTransient<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IAuthorizationHandler, ResourceAuthorizationHandler>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddSignalR();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // var serviceProvider = services.BuildServiceProvider();
            services.AddHttpContextAccessor();
            //here is where you set you accessor
            //  var accessor = serviceProvider.GetService<IHttpContextAccessor>();
            //  CreateReport.SetHttpContextAccessor(accessor);
            services.AddMemoryCache();

            //services.AddResponseCaching();
            //compression static files setting
            //services.AddResponseCompression(options =>
            //{
            //    options.Providers.Add<BrotliCompressionProvider>();
            //    options.Providers.Add<GzipCompressionProvider>();
            //    options.MimeTypes =
            //        ResponseCompressionDefaults.MimeTypes.Concat(
            //            new[] { "image/svg+xml", "text/css", "application/javascript" });
            //});
            //services.Configure<GzipCompressionProviderOptions>(options =>
            //{
            //    options.Level = CompressionLevel.Optimal;
            //});
            //services.Configure<BrotliCompressionProviderOptions>(options =>
            //{
            //    options.Level = CompressionLevel.Optimal;
            //});
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider svp)
        {
            IHttpContextAccessor accessor = svp.GetService<IHttpContextAccessor>();
            DevExpress.XtraReports.Configuration.Settings.Default.UserDesignerOptions.DataBindingMode = DevExpress.XtraReports.UI.DataBindingMode.Expressions;
            app.UseDevExpressControls();
            System.Net.ServicePointManager.SecurityProtocol |= System.Net.SecurityProtocolType.Tls12;
            DevExpress.XtraReports.Web.ClientControls.LoggerService.Initialize(new LoggerService());
            DevExpress.XtraReports.Web.ClientControls.LoggerService.Initialize(ProcessException);
            //--------------------
            app.UseDefaultFiles();
            app.UseAuthentication();
            app.UseMvc();
            app.UseSwagger();
            //app.UseResponseCompression();
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Book API V1");
            });
            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
            app.UseExceptionHandler(
          builder =>
          {
              builder.Run(
                        async context =>
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");

                            var error = context.Features.Get<IExceptionHandlerFeature>();
                            if (error != null)
                            {
                                await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
                            }
                        });
          });
            // Khi deloy
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            //  kho developer

            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();

            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    app.UseHsts();
            //}
            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller}/{action=Index}/{id?}");
            //});
            //app.UseSpa(spa =>
            //{
            //    // To learn more about options for serving an Angular SPA from ASP.NET Core,
            //    // see https://go.microsoft.com/fwlink/?linkid=864501

            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {

            //        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
            //        // spa.UseAngularCliServer(npmScript: "start");
            //    }

            //});
        }
        void ProcessException(Exception ex, string message)
        {
            // Log exceptions here. For instance:
            System.Diagnostics.Debug.WriteLine("[{0}]: Exception occured. Message: '{1}'. Exception Details:\r\n{2}",
                DateTime.Now, message, ex);
        }
    }
}

