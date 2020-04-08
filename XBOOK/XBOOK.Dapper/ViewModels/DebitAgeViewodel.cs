using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class DebitAgeViewodel
    {
        public string clientName { get; set; }
        public decimal Day0To30 { get; set; }
        public decimal Day31To60 { get; set; }
        public decimal Day61To90 { get; set; }
        public decimal Day90More { get; set; }
        public decimal SubTotal { get; set; }
    }
    public class DebitAgeViewodelPrint
    {
        public string companyCode { get; set; }
        public string clientName { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public decimal Day0To30 { get; set; }
        public decimal Day31To60 { get; set; }
        public decimal Day61To90 { get; set; }
        public decimal Day90More { get; set; }
        public decimal SubTotal { get; set; }
    }

}
