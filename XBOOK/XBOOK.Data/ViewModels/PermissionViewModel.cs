using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class PermissionViewModel
    {
        public long Id { get; set; }
        public long RoleId { get; set; }
        public string FunctionId { get; set; }
        public bool Create { set; get; }
        public bool Read { set; get; }
        public bool Update { set; get; }
        public bool Delete { set; get; }

    }
}
