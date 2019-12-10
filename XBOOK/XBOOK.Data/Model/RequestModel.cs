using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class requestGetIMG
    {
        public string ImgName { get; set; }
    }
    public class requestGetFile
    {
        public string Invoice { get; set; }
        public string Seri { get; set; }
    }
    public class ResponseFileName
    {
        public string FileName { get; set; }
    }
}
