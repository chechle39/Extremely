using AutoMapper;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.ViewModels;

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
        }
    }
}
