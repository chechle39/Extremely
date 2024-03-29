﻿using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Dapper.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface ITaxInvoiceServiceDapper
    {
        Task<IEnumerable<TaxInvoiceViewModel>> GetTaxInvoiceAsync(SaleInvoiceListRequest request);
        Task<byte[]> ExportInvoiceAsync();
    }
}
