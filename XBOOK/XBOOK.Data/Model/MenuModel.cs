using System.Collections.Generic;

namespace XBOOK.Data.Model
{
    public class MenuModel
    {
        public string title { get; set; }
        public string icon { get; set; }
        public List<children> children { get; set; }
    }
    public class children
    {
        public string title { get; set; }
        public string link { get; set; }
    }
}
