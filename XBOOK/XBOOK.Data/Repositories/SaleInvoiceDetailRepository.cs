using AutoMapper;
using Microsoft.EntityFrameworkCore;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class SaleInvoiceDetailRepository : Repository<SaleInvDetail>, ISaleInvoiceDetailRepository
    {
        public SaleInvoiceDetailRepository(DbContext context) : base(context)
        {
        }

        public bool CreateSaleIvDetail(SaleInvDetailViewModel request)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(request);
            var createData = Entities.Add(saleInvoiceDetailCreate);
            return true;
        }
    }
}
