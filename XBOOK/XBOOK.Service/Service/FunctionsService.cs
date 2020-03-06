using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class FunctionsService : IFunctionsService
    {
        private readonly IUnitOfWork _uow;
        private readonly IFunctionsRepository _functionsRepository;
        private readonly IAuthorizationService _authorizationService;
        public FunctionsService(IUnitOfWork uow, IFunctionsRepository functionsRepository, IAuthorizationService authorizationService)
        {
            _functionsRepository = functionsRepository;
            _uow = uow;
            _authorizationService = authorizationService;
        }

        public async Task<List<MenuModel>> GetMenu(ClaimsPrincipal user)
        {
            return await _functionsRepository.GetMenu(user);
        }
    }
}
