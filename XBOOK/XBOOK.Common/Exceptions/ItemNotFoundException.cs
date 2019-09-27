using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Common.Exceptions
{
    public class ItemNotFoundException : HttpException
    {
        const int notFoundStatus = 404;
        public ItemNotFoundException() : base(notFoundStatus)
        {
        }

        public ItemNotFoundException(string message)
            : base(notFoundStatus, message)
        {
        }
    }
}
