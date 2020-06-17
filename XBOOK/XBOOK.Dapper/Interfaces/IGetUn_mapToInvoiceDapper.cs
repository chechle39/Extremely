using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IGetUn_mapToInvoiceDapper
    {
        Task<List<GetUn_mapToInvoiceReceiptViewModel>> GetUn_mapToInvoiceReceipt(GetUn_mapToInvoiceReceiptRequest rq);
    }
}
