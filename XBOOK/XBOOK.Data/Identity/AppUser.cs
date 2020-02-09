using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace XBOOK.Data.Identity
{
    [Table("AppUsers")]
    public class AppUser : IdentityUser<int>
    {
        public AppUser() { }
        public AppUser(int id, string fullName, string userName,
            string email, string phoneNumber, string avatar, bool status)
        {
            Id = id;
            FullName = fullName;
            UserName = userName;
            Email = email;
            PhoneNumber = phoneNumber;
            Avatar = avatar;
            Status = status;
        }
        public string FullName { get; set; }
        public string Avatar { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool Status { get; set; }
    }
}
