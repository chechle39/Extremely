using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace XBOOK.Data.Identity
{
    public class AppRole: IdentityRole<int>
    {
        public AppRole() : base()
        {

        }
        public AppRole(string name, string description) : base(name)
        {
            this.Description = description;
        }

        //public RoleType Type { get; set; }

        [StringLength(250)]
        public string Description { get; set; }
    }
}
