using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Common.Exceptions;

namespace XBOOK.Data.Base
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class
    {
        private readonly DbContext _dbContext;

        public DbSet<TEntity> Entities { get; }

        public Repository(DbContext dbContext)
        {
            _dbContext = dbContext;
            Entities = _dbContext.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> AsQueryable()
        {
            return Entities.AsQueryable();
        }

        public async Task Add(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            Entities.Add(entity);
            await _dbContext.SaveChangesAsync();
        }

        public void AddData(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            Entities.Add(entity);
        }
        public async Task Add(IEnumerable<TEntity> entities)
        {
            if (entities == null)
                throw new ArgumentNullException(nameof(entities));

            Entities.AddRange(entities);
            await _dbContext.SaveChangesAsync();
        }

        public virtual TEntity GetById(object id)
        {
            return Entities.Find(id);
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            return Entities;
        }

        public async Task Update(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            Entities.Update(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task  Update(IEnumerable<TEntity> entities)
        {
            if (entities == null)
                throw new ArgumentNullException(nameof(entities));

            Entities.UpdateRange(entities);
            await _dbContext.SaveChangesAsync();
        }

        public void Remove(int id)
        {
            var entity = GetById(id);
            if (entity == null)
                throw new ItemNotFoundException();

            Entities.Remove(entity);
        }

        public virtual void Remove(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            Entities.Remove(entity);
        }

        public virtual void Remove(params TEntity[] entities)
        {
            if (entities == null)
                throw new ArgumentNullException(nameof(entities));

            Entities.RemoveRange(entities);
        }

        public virtual void Remove(IEnumerable<TEntity> entities)
        {
            if (entities == null)
                throw new ArgumentNullException(nameof(entities));

            Entities.RemoveRange(entities);
        }

        public async Task Remove(long id)
        {
            var entity = GetById(id);
            if (entity == null)
                throw new ItemNotFoundException();

            Entities.Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        public int SaveChanges()
        {
            return _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
            GC.SuppressFinalize(this);
        }

        public async Task<TEntity> GetByIdDataAsync(long id)
        {
            var query = Entities.FindAsync(id);

            return await query;
        }
    }
}
