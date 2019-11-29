using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class CompanyProfile
    {
        public CompanyProfile(string address, string bizPhone, string city, string companyName, string country, string currency, string dateFormat, string directorName, string logoFilePath, string mobilePhone, string taxCode, string zipCode)
        {
            Address = address;
            BizPhone = bizPhone;
            City = city;
            CompanyName = companyName;
            Country = country;
            Currency = currency;
            DateFormat = dateFormat;
            DirectorName = directorName;
            LogoFilePath = logoFilePath;
            MobilePhone = mobilePhone;
            TaxCode = taxCode;
            ZipCode = zipCode;
        }

        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
        public string Currency { get; set; }
        public string DateFormat { get; set; }
        public string BizPhone { get; set; }
        public string MobilePhone { get; set; }
        public string DirectorName { get; set; }
        public string LogoFilePath { get; set; }
        public string TaxCode { get; set; }
        public int Id { get; set; }
    }
}
