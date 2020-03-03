using System.ComponentModel.DataAnnotations;

namespace XBOOK.Data.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
