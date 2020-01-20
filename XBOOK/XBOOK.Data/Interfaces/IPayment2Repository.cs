using System.Threading.Tasks;

namespace XBOOK.Data.Interfaces
{
    public interface IPayment2Repository
    {
        Task<bool> DeletedPaymentAsync(string request);

    }
}
