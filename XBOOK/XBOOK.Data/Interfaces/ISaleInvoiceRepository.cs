using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ISaleInvoiceRepository : IRepository<SaleInvoice>
    {
        bool UpdateSaleInv(SaleInvoiceViewModel rs);
    }
}
