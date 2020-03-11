using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web.Helpers
{
    public class Tokens
    {
        public static async Task<string> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName, JwtIssuerOptions jwtOptions, JsonSerializerSettings serializerSettings, IList<string> roles, IEnumerable<PermissionViewModel> permissions)
        {
            var response = new
            {
                id = identity.Claims.Single(c => c.Type == "id").Value,
                auth_token = await jwtFactory.GenerateEncodedToken(userName, identity, roles),
                expires_in = (int)jwtOptions.ValidFor.TotalSeconds,
                role = roles,
                permission = permissions
            };

            return JsonConvert.SerializeObject(response, serializerSettings);
        }
    }
}
