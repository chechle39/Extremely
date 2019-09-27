using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Common.Exceptions
{
    public class HttpException : Exception
    {
        public int StatusCode { get; set; }

        public HttpException(int statusCode)
        {
            StatusCode = statusCode;
        }

        public HttpException(int statusCode, string message)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
