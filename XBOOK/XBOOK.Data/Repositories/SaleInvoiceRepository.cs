using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class SaleInvoiceRepository : Repository<SaleInvoice>, ISaleInvoiceRepository
    {
        public SaleInvoiceRepository(DbContext context) : base(context)
        {
        }
        public bool UpdateSaleInv(SaleInvoiceViewModel rs)
        {
            var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(rs);
            Entities.Update(saleInvoice);
            return true;
        }
    }
}
