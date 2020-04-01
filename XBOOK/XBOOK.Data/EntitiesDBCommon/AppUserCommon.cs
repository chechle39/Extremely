using System.ComponentModel.DataAnnotations;

namespace XBOOK.Data.EntitiesDBCommon
{
    public partial class AppUserCommon
    {
        [Key]
        public long ID { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
    }
}
