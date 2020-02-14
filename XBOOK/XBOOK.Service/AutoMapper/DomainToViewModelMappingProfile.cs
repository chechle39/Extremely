using AutoMapper;
using XBOOK.Data.Entities;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.AutoMapper
{
    public class DomainToViewModelMappingProfile: Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<AccountBalance, AccountBalanceViewModel>();
            CreateMap<Client, ClientViewModel>();
            CreateMap<Client, ClientCreateRequet>();
            CreateMap<SaleInvoice, SaleInvoiceModelRequest>();
            CreateMap<SaleInvoice, SaleInvoiceViewModel>();
            CreateMap<Payments, PaymentViewModel>();
            CreateMap<SaleInvDetail, SaleInvDetailViewModel>();
            CreateMap<Tax, TaxViewModel>();
            CreateMap<MasterParam, MasterParamViewModel>();
            CreateMap<Product, ProductViewModel>();
            CreateMap<Category, CategoryViewModel>();
            CreateMap<GeneralLedger, GeneralLedgerViewModel>();
            CreateMap<AccountChart, AccountChartViewModel>();
            CreateMap<AccountChart, TreeNode>();
            CreateMap<CompanyProfile, CompanyProfileViewModel>();
            CreateMap<MoneyReceipt, MoneyReceiptViewModel>();
            CreateMap<EntryPattern, EntryPatternViewModel>();
            CreateMap<BuyInvoice, BuyInvoiceViewModel>();
            CreateMap<Supplier, SupplierCreateRequest>();
            CreateMap<Supplier, SupplierViewModel>();
            CreateMap<BuyInvoice, BuyInvoiceModelRequest>();
            CreateMap<BuyInvDetail, BuyInvDetailViewModel>();
            CreateMap<Payments_2, Payment2ViewModel>();
            CreateMap<PaymentReceipt, PaymentReceiptViewModel>();
            CreateMap<AppUser, ApplicationUserViewModel>();
            CreateMap<AppRole, ApplicationRoleViewModel>();
        }
    }
}
