using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using XBOOK.Data.Interfaces;

namespace XBOOK.Data.Identity
{
    [Table("AppUsers")]
    public class AppUser : IdentityUser<int>, IDateTracking, ISwitchable
    {
        private Status status;

        public AppUser() { }

        public AppUser(int id, string fullName, string userName, string email, string phoneNumber, string avatar, Status status)
        {
            Id = id;
            FullName = fullName;
            UserName = userName;
            Email = email;
            PhoneNumber = phoneNumber;
            Avatar = avatar;
            this.status = status;
        }

        public string FullName { get; set; }

        public DateTime BirthDay { set; get; }

        public decimal Balance { get; set; }

        public string Avatar { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public Status Status { get; set; }
    }
}