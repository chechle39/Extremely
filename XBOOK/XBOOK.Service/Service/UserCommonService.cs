using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class UserCommonService : IUserCommonService
    {
        private readonly IUserCommonRepository _userCommonRepository;
        private readonly ICachingService _cachingService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserCommonService(IUserCommonRepository userCommonRepository, ICachingService cachingService, IHttpContextAccessor httpContextAccessor)
        {
            _userCommonRepository = userCommonRepository;
            _cachingService = cachingService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AppUserCommon> FindUserCommon(string email)
        {
            var data = await _userCommonRepository.FindUserCommon(email);
            //_cachingService.Remove(CacheKey.UserCompany.UseCommon);
            return _cachingService.GetObject(CacheKey.UserCompany.UseCommon + "-" + data.Code, () =>
            {
                return data;
            });
        }
    }
}
