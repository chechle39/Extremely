using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class Tax
    {
        public Tax(int iD, string taxName, decimal? taxRate)
        {
            Id = iD;
            TaxName = taxName;
            TaxRate = taxRate;
        }

        public int Id { get; set; }
        public string TaxName { get; set; }
        public decimal? TaxRate { get; set; }
    }
}
