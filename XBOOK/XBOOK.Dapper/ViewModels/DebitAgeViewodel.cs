using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class DebitAgeViewodel
    {
        public string CompanyName { get; set; }
        public decimal FirstMonth { get; set; }
        public decimal SecondMonth { get; set; }
        public decimal ThirdMonth { get; set; }
        public decimal fourthMonth { get; set; }
        public decimal Sumtotal { get; set; }
    }
    public class DebitAgeViewodelPrint
    {
        public string companyCode { get; set; }
        public string CompanyName { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public decimal FirstMonth { get; set; }
        public decimal SecondMonth { get; set; }
        public decimal ThirdMonth { get; set; }
        public decimal fourthMonth { get; set; }
        public decimal Sumtotal { get; set; }
    }

}
