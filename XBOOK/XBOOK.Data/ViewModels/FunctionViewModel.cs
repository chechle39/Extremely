using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class FunctionViewModel
    {
        public string Id { get; set; }
        public string IconCss { get; set; }
        public string Name { get; set; }
        public string ParentId { get; set; }
        public int SortOrder { get; set; }
        public int Status { get; set; }
        public string URL { get; set; }
    }
}
