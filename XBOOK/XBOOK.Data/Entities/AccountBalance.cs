namespace XBOOK.Data.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public partial class AccountBalance
    {

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AccountBalance()
        {

        }

        public AccountBalance(string accNumber, string accName, decimal debitOpening, decimal creditOpening, decimal debit, decimal credit, decimal debitClosing, decimal creditClosing)
        {
            accNumber = accNumber;
            this.accName = accName;
            this.debitOpening = debitOpening;
            this.creditOpening = creditOpening;
            this.debit = debit;
            this.credit = credit;
            this.debitClosing = debitClosing;
            this.creditClosing = creditClosing;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public string accNumber { get; set; }
        public string accName { get; set; }
        public decimal debitOpening { get; set; }
        public decimal creditOpening { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
        public decimal debitClosing { get; set; }
        public decimal creditClosing { get; set; }

    }
        

}
