using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class PermissionRepository:Repository<Permission>, IPermissionRepository
    {
        private readonly IFunctionsRepository _functionsRepository;
        private RoleManager<AppRole> _roleManager;
        public PermissionRepository(XBookContext context, IFunctionsRepository functionsRepository, RoleManager<AppRole> roleManager) : base(context)
        {
            _functionsRepository = functionsRepository;
            _roleManager = roleManager;
        }

        public async Task<List<PermissionViewModel>> GetAllPermissAsync()
        {
            var data = await Entities.ProjectTo<PermissionViewModel>().ToListAsync();
            return data;
        }
    }
}
