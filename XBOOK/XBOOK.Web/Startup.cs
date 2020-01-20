using AutoMapper;
using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using DevExpress.XtraReports.Web.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using System.IO;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.Service;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Repositories;
using XBOOK.Service.Interfaces;
using XBOOK.Service.Service;
using DevExpress.XtraReports.Security;
using DevExpress.Security.Resources;
namespace XBOOK.Web
{
    public class Startup
    {
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
            services.AddDevExpressControls();
            services.AddScoped<ReportStorageWebExtension, XBOOK.Report.Services.ReportStorageWebExtension>();
            services
                .AddMvc()
                .AddDefaultReportingControllers()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.ConfigureReportingServices(configurator => {
                configurator.ConfigureReportDesigner(designerConfigurator => {
                    designerConfigurator.RegisterDataSourceWizardConfigFileConnectionStringsProvider();
                });
                configurator.ConfigureWebDocumentViewer(viewerConfigurator => {
                    viewerConfigurator.UseCachedReportSourceBuilder();
                });
            });
            //------------------
            services.AddCors();
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddDbContext<XBookContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddAutoMapper();
            services.AddSingleton(Mapper.Configuration);
            services.AddScoped<IMapper>(sp => new Mapper(sp.GetRequiredService<AutoMapper.IConfigurationProvider>(), sp.GetService));
            services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            services.AddTransient<ISaleInvoiceService, SaleInvoiceService>();
            services.AddTransient<IPaymentsService, PaymentsService>();
            services.AddTransient<IClientService, ClientService>();
            services.AddTransient<ISaleInvDetailService, SaleInvDetailService>();
            services.AddTransient<IGeneralLedgerService, GeneralLedgerService>();
            services.AddTransient<ITaxService, TaxService>();
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
            services.AddTransient<ISalesReportServiceDapper, SalesReportServiceDapper>();
            services.AddTransient<IDebitageServiceDapper, DebitAgeServiceDapper>();
            services.AddTransient<IPaymentReceiptRepository, PaymentReceiptRepository>();
            services.AddTransient<IClientRepository, ClientRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IPaymentRepository, PaymentRepository>();
            services.AddTransient<ISaleInvoiceRepository, SaleInvoiceRepository>();
            services.AddTransient<ISaleInvoiceDetailRepository, SaleInvoiceDetailRepository>();
            services.AddTransient<ICompanyProfileReponsitory, CompanyProfileReponsitory>();
            services.AddTransient<ITaxRepository, TaxRepository>();
            services.AddTransient<IMoneyReceiptRepository, MoneyReceiptRepository>();
            services.AddTransient<IEntryPatternRepository, EntryPatternRepository>();
            services.AddTransient<IBuyInvoiceRepository, BuyInvoiceRepository>();
            services.AddTransient<ISupplierRepository, SupplierRepository>();
            services.AddTransient<IBuyInvDetailRepository, BuyInvDetailRepository>();
            services.AddTransient<IPayment2Repository, Payment2Repository>();
            services.AddTransient<IAccountDetailServiceDapper, AccountDetailServiceDapper>();

            services.AddTransient<IClientServiceDapper, ClientServiceDapper>();
            services.AddTransient<IAccountBalanceServiceDapper, AccountBalanceServiceDapper>();
            services.AddTransient<IInvoiceServiceDapper, InvoiceServiceDapper>();
            services.AddTransient<IMoneyReceiptDapper, MoneyReceiptServiceDapper>();
            services.AddTransient<IBuyInvoiceServiceDapper, BuyInvoiceServiceDapper>();
            services.AddTransient<ISupplierServiceDapper, SupplierServiceDapper>();
            services.AddTransient<IPaymentReceiptServiceDapper, PaymentReceiptServiceDapper>();

            services.AddTransient<ReportStorageWebExtension, XBOOK.Report.Services.ReportStorageWebExtension>();
            services.AddScoped<DbContext, XBookContext>();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddSignalR();
            // services.AddAuthentication(IISServerDefaults.AuthenticationScheme);
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            DevExpress.XtraReports.Configuration.Settings.Default.UserDesignerOptions.DataBindingMode = DevExpress.XtraReports.UI.DataBindingMode.Expressions;

            app.UseDevExpressControls();
            System.Net.ServicePointManager.SecurityProtocol |= System.Net.SecurityProtocolType.Tls12;







            //--------------------
            app.UseAuthentication();
            app.UseCors();
            app.UseDefaultFiles();
            app.UseSwagger();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot")),
                RequestPath = new PathString("/wwwroot")
            });
            app.UseDirectoryBrowser(new DirectoryBrowserOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
                RequestPath = "/img"
            });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Book API V1");
            });

            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();

            app.UseHttpsRedirection();
            app.UseMvc();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

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
    }
}

