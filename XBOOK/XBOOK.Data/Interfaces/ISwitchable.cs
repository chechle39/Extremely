using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Identity;

namespace XBOOK.Data.Interfaces
{
    public interface ISwitchable
    {
        Status Status { set; get; }
    }
}
