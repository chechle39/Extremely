using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Interfaces;

namespace XBOOK.Dapper.Service
{
    public class GetUn_mapToInvoiceDapper : IGetUn_mapToInvoiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public GetUn_mapToInvoiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<List<GetUn_mapToInvoiceReceiptViewModel>> GetUn_mapToInvoiceReceipt(GetUn_mapToInvoiceReceiptRequest rq)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@InvoiveID", rq.InvoiveID);
                dynamicParameters.Add("@isSale", rq.IsSale);
                var data = await sqlConnection.QueryAsync<GetUn_mapToInvoiceReceiptViewModel>(
                   "GetUn_mapToInvoiceReceipt", dynamicParameters, commandType: CommandType.StoredProcedure);
                return data.ToList();
            }
        }
    }
}
