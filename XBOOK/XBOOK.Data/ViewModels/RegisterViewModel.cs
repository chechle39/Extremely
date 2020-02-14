using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class RegisterViewModel
    {
        public string FullName { set; get; }
        public DateTime BirthDay { set; get; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { set; get; }
        public string Avatar { get; set; }
    }

    public class requestEmail
    {
        public string email { get; set; }
    }
}
