using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public static class CacheKey
    {
        public static class UserCompany
        {
            public static string UseCommon = nameof(UseCommon);

        }
        public static class Masterparam
        {
            public static string MasTerByPaymentReceipt = nameof(MasTerByPaymentReceipt);
            public static string MasTerByMoneyReceipt = nameof(MasTerByMoneyReceipt);
            public static string PaymentType = nameof(PaymentType);

        }

    }
}
