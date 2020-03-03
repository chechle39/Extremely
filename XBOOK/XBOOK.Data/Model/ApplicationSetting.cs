using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class ApplicationSetting
    {
        public string JWT_Secret { get; set; }
        public string Client_URL { get; set; }
    }
}
