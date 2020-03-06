using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using XBOOK.Data.Identity;

namespace XBOOK.Data.Entities
{
    public class Permission
    {
        public Permission() { }

        public Permission(long id, bool read, long roleId, bool update, bool create, bool delete, string functionId)
        {
            Id = id;
            Read = read;
            RoleId = roleId;
            Update = update;
            Create = create;
            Delete = delete;
            FunctionId = functionId;
        }

        [Key]
        public long Id { get; set; }
        [Required]
        public long RoleId { get; set; }

        [StringLength(128)]
        [Required]
        public string FunctionId { get; set; }

        public bool Create { set; get; }
        public bool Read { set; get; }

        public bool Update { set; get; }
        public bool Delete { set; get; }


        //[ForeignKey("RoleId")]
        //public virtual AppRole AppRole { get; set; }

        [ForeignKey("FunctionId")]
        public virtual Functions Function { get; set; }
    }
}
