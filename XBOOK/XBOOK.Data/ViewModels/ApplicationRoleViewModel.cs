using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class ApplicationRoleViewModel
    {
        public ApplicationRoleViewModel()
        {
            RoleClaims = new List<Claim>();
        }

        public int Id { set; get; }

        public string Name { set; get; }

        public string Description { set; get; }

        public List<Claim> RoleClaims { get; set; }

        //public List<RequestClaims> RequestData { get; set; }
    }

    public class RequestClaims
    {
        public string Name { set; get; }

        public string Type { set; get; }
    }
}
