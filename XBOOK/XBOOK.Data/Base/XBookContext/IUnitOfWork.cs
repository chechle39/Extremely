namespace XBOOK.Data.Base
{
    public interface IUnitOfWork
    {
        int SaveChanges();
        void BeginTransaction();

        void CommitTransaction();
        void RollbackTransaction();
        TRepository GetRepository<TRepository>()
            where TRepository : IRepository;
    }
}
