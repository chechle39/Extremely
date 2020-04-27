using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class FunctionsRepository : Repository<Functions>, IFunctionsRepository
    {
        private readonly IAuthorizationService _authorizationService;
        public FunctionsRepository(XBookContext context, IAuthorizationService authorizationService) : base(context)
        {
            _authorizationService = authorizationService;
        }

        public async Task<List<FunctionViewModel>> GetAllFunction()
        {
            var data = await Entities.ProjectTo<FunctionViewModel>().ToListAsync();
            return data;
        }
    }
}
