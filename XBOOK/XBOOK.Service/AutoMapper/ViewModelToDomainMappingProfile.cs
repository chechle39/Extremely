using AutoMapper;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.AutoMapper
{
    class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {

            CreateMap<ClientViewModel, Client>()
           .ConstructUsing(c => new Client(c.ClientId, c.Address, c.ClientName, c.ContactName, c.Email,c.Note,c.Tag,c.TaxCode));

            CreateMap<ClientCreateRequet, Client>()
           .ConstructUsing(c => new Client(c.ClientId, c.Address, c.ClientName, c.ContactName, c.Email, c.Note, c.Tag, c.TaxCode));

            CreateMap<SaleInvoiceViewModel, SaleInvoice>()
            .ConstructUsing(x => new SaleInvoice(x.InvoiceId,x.InvoiceNumber,x.InvoiceSerial,x.IssueDate,
           x.ClientId,x.Discount,x.DiscRate,x.DueDate,x.Note,x.Term,x.Status));

            CreateMap<SaleInvoiceModelRequest, SaleInvoice>()
            .ConstructUsing(x => new SaleInvoice(x.InvoiceId, x.InvoiceNumber, x.InvoiceSerial, x.IssueDate,x.ClientId,
           x.Discount, x.DiscRate, x.DueDate, x.Note, x.Term, x.Status));

            CreateMap<SaleInvoiceModelRequest, SaleInvoiceViewModel>()
           .ConstructUsing(x => new SaleInvoiceViewModel(x.InvoiceId, x.InvoiceNumber, x.InvoiceSerial, x.IssueDate, x.ClientId,
          x.Discount, x.DiscRate, x.DueDate, x.Note, x.Term, x.Status));

            CreateMap<PaymentViewModel, Payments>().ConstructUsing(x => new Payments(x.Amount, x.BankAccount, x.Id, x.InvoiceId,
                x.Note, x.PayDate, x.PayType, x.PayTypeID));
            CreateMap<SaleInvDetailViewModel, SaleInvDetail>().ConstructUsing(x => new SaleInvDetail(x.InvoiceId,x.Price,x.ProductId
                ,x.ProductName,x.Qty,x.Vat,x.Id,x.Amount));


        }
    }
}
