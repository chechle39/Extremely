﻿using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Identity;

namespace XBOOK.Data.ViewModels
{
    public class ApplicationUserViewModel
    {
        public ApplicationUserViewModel()
        {
            Roles = new List<string>();
        }
        public int Id { set; get; }
        public string FullName { set; get; }
        public DateTime BirthDay { set; get; }
        public string Email { set; get; }
        public string Password { set; get; }
        public string UserName { set; get; }
        public string Address { get; set; }
        public string PhoneNumber { set; get; }
        public string Avatar { get; set; }
        public Status Status { get; set; }

        public string Gender { get; set; }

        public DateTime DateCreated { get; set; }

        public List<string> Roles { get; set; }
    }
}
