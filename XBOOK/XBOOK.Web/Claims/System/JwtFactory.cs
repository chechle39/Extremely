using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;

namespace XBOOK.Web.Claims.System
{
    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtOptions;
       // private readonly UserManager<AppUser> _userManager;
        public JwtFactory(IOptions<JwtIssuerOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        public async Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity, IList<string> roles)
        {
            var claims = new List<Claim>();
            //var claims = new[]
            //{
            //     new Claim(ClaimTypes.Name, userName),
            //     new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
            //     new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
            //     identity.FindFirst(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Rol),
            //     identity.FindFirst(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Id),
            //     new Claim(ClaimTypes.Role, roles[0])
            //   //  new Claim (ClaimTypes.Role, "xx")

            // };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            claims.Add(new Claim(ClaimTypes.Name, userName));
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()));
            claims.Add(new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64));
            claims.Add(identity.FindFirst(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Rol));
            claims.Add(identity.FindFirst(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Id));
            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        public ClaimsIdentity GenerateClaimsIdentity(string userName, string id)
        {
            var x = new ClaimsIdentity(new GenericIdentity(userName, "Token"), new[]
            {
                new Claim(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Id, id),
                new Claim(XBOOK.Common.Helpers.Constants.Strings.JwtClaimIdentifiers.Rol, XBOOK.Common.Helpers.Constants.Strings.JwtClaims.ApiAccess),
            });
 
            return x;
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
          => (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
