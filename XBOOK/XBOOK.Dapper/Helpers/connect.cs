using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Linq;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.helpers
{
    public class connect
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;
        public connect(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public string ConnectString()
        {
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            string codeKey;
            if (_cache.TryGetValue(CacheKey.UserCompany.UseCommon + code, out AppUserCommon cacheData))
            {
                codeKey = cacheData.ConnectionString;
            }
            else
            {
                var mail = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
                var userCommon = _userCommonRepository.FindUserCommon(mail).Result;
                codeKey = userCommon.ConnectionString;
                _cache.Set(CacheKey.UserCompany.UseCommon + code, userCommon);
            }

            return codeKey;
        }

    }
}
