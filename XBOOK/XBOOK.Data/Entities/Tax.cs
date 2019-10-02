namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tax
    {
        public Tax(int iD, string taxName, decimal? taxRate)
        {
            ID = iD;
            this.taxName = taxName;
            this.taxRate = taxRate;
        }

        public int ID { get; set; }
        public string taxName { get; set; }
        public Nullable<decimal> taxRate { get; set; }
    }
}
