using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IPayment2Repository
    {
        Task<bool> DeletedPaymentAsync(string request);
        Task<bool> UpdatePaymentByReceiptNumber(PaymentReceiptViewModel request);
    }
}
