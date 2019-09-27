using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
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
        }
    }
}
