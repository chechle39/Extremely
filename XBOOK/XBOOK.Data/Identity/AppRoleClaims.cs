using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace XBOOK.Data.Identity
{
    [Table("AppRoleClaims")]
    public class AppRoleClaims : IdentityRoleClaim<int>
    {
        public AppRoleClaims() : base()
        {

        }
        public AppRoleClaims(string claimType, string claimValue)
        {
            this.ClaimType = claimType;
            this.ClaimValue = claimValue;
        }
    }
}
