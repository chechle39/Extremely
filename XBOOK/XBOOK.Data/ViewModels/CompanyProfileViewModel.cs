using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class CompanyProfileViewModel
    {
        public int Id { get; set; }
        public string companyName { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string zipCode { get; set; }
        public string currency { get; set; }
        public string dateFormat { get; set; }
        public string bizPhone { get; set; }
        public string mobilePhone { get; set; }
        public string directorName { get; set; }
        public string logoFilePath { get; set; }
        public string taxCode { get; set; }
    }
}
