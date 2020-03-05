using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using XBOOK.Data.Interfaces;

namespace XBOOK.Data.Identity
{
    [Table("AppUsers")]
    public class AppUser : IdentityUser<int>, IDateTracking, ISwitchable
    {
        private Status status3;

        public AppUser() { }

        public AppUser(int id, string fullName, string userName, string email, string phoneNumber, string avatar, Status status3, string gender, DateTime birthDay, string address)
        {
            Id = id;
            FullName = fullName;
            UserName = userName;
            Email = email;
            PhoneNumber = phoneNumber;
            Avatar = avatar;
            this.status3 = status3;
            Gender = gender;
            BirthDay = birthDay;
            Address = address;
        }

        public string FullName { get; set; }

        public DateTime BirthDay { set; get; }

        public decimal Balance { get; set; }

        public string Avatar { get; set; }
        public string Address { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public Status Status { get; set; }
        public string Gender { get; set; }
    }
}