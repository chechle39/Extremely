using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace XBOOK.Data.Base
{
    public interface IRepository<TEntity> : IRepository
        where TEntity : class
    {
        IQueryable<TEntity> AsQueryable();

        Task Add(TEntity entity);

        Task Add(IEnumerable<TEntity> entities);

        TEntity GetById(object id);

        IQueryable<TEntity> GetAll();

        Task Update(TEntity entity);

        Task Update(IEnumerable<TEntity> entities);

        Task Remove(long id);

        void Remove(int id);

        void Remove(TEntity entity);

        void Remove(params TEntity[] entities);

        void Remove(IEnumerable<TEntity> entities);
        Task<TEntity> GetByIdDataAsync(long id);

    }

    public interface IRepository : IDisposable
    {
        int SaveChanges();
    }
}
