using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace XBOOK.Web.Claims.System
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity, IList<string> roles);
        ClaimsIdentity GenerateClaimsIdentity(string userName, string id);
    }
}
