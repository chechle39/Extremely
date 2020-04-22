using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Service.Interfaces
{
    public interface ICachingService
    {
        T GetObject<T>(string cacheKey, int expireInMinute, Func<T> objectFunction);
        T GetObject<T>(string cacheKey, Func<T> objectFunction);
        void Remove(string cacheKey);
    }
}
