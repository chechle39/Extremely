using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Identity
{
    public abstract class EntityIdentityBase<T>
    {
        public T Id { get; set; }
        public bool IsTransient()
        {
            return Id.Equals(default(T));
        }
    }
}
