using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ITaxBuyInvDetailRepository
    {
        Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
        Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel);
    }
}
