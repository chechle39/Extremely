using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ITaxBuyInvDetailService
    {
        Task<bool> CreateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel);
        Task<bool> UpdateTaxInvDetail(TaxBuyInvDetailViewModel taxInvDetailViewModel);
    }
}
