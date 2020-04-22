using System;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class MemoryCacheService : ICachingService
    {
        private readonly IMemoryCache _cache;

        #region Constructor

        public MemoryCacheService(IMemoryCache cache)
        {
            _cache = cache;
        }

        #endregion

        public T GetObject<T>(string cacheKey, int expireInMinute, Func<T> objectFunction)
        {
            if (_cache.TryGetValue(cacheKey, out T cachedObject))
            {
                return cachedObject;
            }

            var options = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(expireInMinute),
                SlidingExpiration = TimeSpan.FromMinutes(5)
            };

            cachedObject = objectFunction();
            _cache.Set(cacheKey, cachedObject, options);

            return cachedObject;
        }

        public T GetObject<T>(string cacheKey, Func<T> objectFunction)
        {
            return GetObject(cacheKey, 60, objectFunction);
        }

        public void Remove(string cacheKey)
        {
            _cache.Remove(cacheKey);
        }
    }
}
