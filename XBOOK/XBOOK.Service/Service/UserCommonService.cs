using System;
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
        public UserCommonService(IUserCommonRepository userCommonRepository, ICachingService cachingService)
        {
            _userCommonRepository = userCommonRepository;
            _cachingService = cachingService;
        }

        public async Task<AppUserCommon> FindUserCommon(string email)
        {
            var data = await _userCommonRepository.FindUserCommon(email);
            return _cachingService.GetObject(CacheKey.UserCompany.UseCommon, () =>
            {
                return data;
            });
        }
    }
}
