﻿using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
namespace XBOOK.Service.Interfaces
{
    public interface IFunctionsService
    {
        Task<List<FunctionViewModel>> GetAllFunction();
    }
}
