using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class PermissionRepository:Repository<Permission>, IPermissionRepository
    {
        public PermissionRepository(DbContext context) : base(context)
        {
        }

        public async Task<List<PermissionViewModel>> GetAllPermissAsync()
        {
            var data = await Entities.ProjectTo<PermissionViewModel>().ToListAsync();
            return data;
        }
    }
}
