﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Interfaces
{
    public interface IPermissionDapper
    {
        Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId, string code);
        Task<List<MenuModel>> GetMenu(long userId);
    }
}
