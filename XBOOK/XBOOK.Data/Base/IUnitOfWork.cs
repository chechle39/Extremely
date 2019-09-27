using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Base
{
    public interface IUnitOfWork
    {
        int SaveChanges();

        TRepository GetRepository<TRepository>()
            where TRepository : IRepository;
    }
}
