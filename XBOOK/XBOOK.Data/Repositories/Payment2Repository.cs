using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class Payment2Repository : Repository<Payments_2>, IPayment2Repository
    {
        public Payment2Repository(XBookContext context) : base(context)
    {
    }

    public async Task<bool> DeletedPaymentAsync(string request)
    {
        var finData = Entities.Where(x => x.receiptNumber == request).ToList();
        if (finData.Count() > 0)
        {
            foreach (var item in finData)
            {
                Entities.Remove(item);

            }
            return await Task.FromResult(true);
        }
        else
        {
            return false;
        }

    }

        public async Task<bool> UpdatePaymentByReceiptNumber(PaymentReceiptViewModel request)
        {
            var finData = Entities.Where(x => x.receiptNumber == request.ReceiptNumber).AsNoTracking().ToList();
            var update = new Payments_2()
            {
                amount = request.Amount,
                ID = finData[0].ID,
                invoiceID = finData[0].invoiceID,
                receiptNumber = request.ReceiptNumber,
                note = request.Note,
                payDate = request.PayDate,
                payName = request.PayName,
                payType = request.PayType,
            };

            Entities.Update(update);

            return await Task.FromResult(true);
        }
    }
}
