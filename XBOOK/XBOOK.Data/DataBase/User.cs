using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FristName { get; set; }
        public string LastName { get; set; }
        public string Type { get; set; }
        public string Token { get; set; }
    }
}
