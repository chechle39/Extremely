﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using System;
using XBOOK.Data.EntitiesDBCommon;

namespace XBOOK.Data.Base.XBookContextCommon
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly XBookComonContext _dbContext;
        private readonly IServiceProvider _serviceProvider;
        private IDbContextTransaction _transaction;

        public UnitOfWork(XBookComonContext dbContext, IServiceProvider serviceProvider)
        {
            _dbContext = dbContext;
            _serviceProvider = serviceProvider;
        }

        public TRepository GetRepository<TRepository>()
            where TRepository : IRepository
        {
            return _serviceProvider.GetService<TRepository>();
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

        public void BeginTransaction()
        {
            _transaction = _dbContext.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            if (_transaction != null)
            {
                _transaction.Commit();
                _transaction.Dispose();
            }
        }

        public void RollbackTransaction()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
            }
        }
    }
}
