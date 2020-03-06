﻿using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Interfaces
{
    public interface IAccountDetailServiceDapper
    {
        Task<IEnumerable<AccountDetailGroupViewModel>> GetAccountDetailAsync(AccountDetailSerchRequest request);
        Task<IEnumerable<AccountDetailViewModel>> GetAccountDetailReportAsync(AccountDetailSerchRequest request);
    }
}