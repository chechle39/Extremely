using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public class CompanyProfile
    {
        public CompanyProfile(string address, string bizPhone, string city, string companyName, string country, string currency, string dateFormat, string directorName, string logoFilePath, string mobilePhone, string taxCode, string zipCode)
        {
            this.address = address;
            this.bizPhone = bizPhone;
            this.city = city;
            this.companyName = companyName;
            this.country = country;
            this.currency = currency;
            this.dateFormat = dateFormat;
            this.directorName = directorName;
            this.logoFilePath = logoFilePath;
            this.mobilePhone = mobilePhone;
            this.taxCode = taxCode;
            this.zipCode = zipCode;
        }

        [Key]
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
