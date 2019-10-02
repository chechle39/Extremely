namespace XBOOK.Data.Base
{
    public interface IUnitOfWork
    {
        int SaveChanges();

        TRepository GetRepository<TRepository>()
            where TRepository : IRepository;
    }
}
