using AutoMapper;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.AutoMapper
{
    class DomainToViewModelMappingProfile: Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<Client, ClientViewModel>();
            CreateMap<Client, ClientCreateRequet>();
            CreateMap<SaleInvoice, SaleInvoiceModelRequest>();
            CreateMap<SaleInvoice, SaleInvoiceViewModel>();
            CreateMap<Payments, PaymentViewModel>();
            CreateMap<SaleInvDetail, SaleInvDetailViewModel>();
            CreateMap<Tax, TaxViewModel>();
            CreateMap<Product, ProductViewModel>();
            CreateMap<Category, CategoryViewModel>();
            CreateMap<GeneralLedger, GeneralLedgerViewModel>();
            CreateMap<AccountChart, AccountChartViewModel>();
            CreateMap<CompanyProfile, CompanyProfileViewModel>();
        }
    }
}
