using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XBOOK.Data.Identity;

namespace XBOOK.Data.Entities
{
    public class AppUserRoles
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        [ForeignKey("UserId")]
        public virtual AppUser User { set; get; }
        [ForeignKey("RoleId")]
        public virtual AppRole Role { set; get; }
    }
}
