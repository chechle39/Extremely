using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class DebitAgeServiceDapper : IDebitageServiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public DebitAgeServiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<DebitAgeViewodel>> GetDebitageServiceDapperAsync(DebitageModelSearchRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                string deltaFrom = request.FirstDate;
                DateTime fromDate = DateTime.Parse(deltaFrom, new CultureInfo("en-GB"));
               
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();               
                    dynamicParameters.Add("@Date", fromDate);
                    dynamicParameters.Add("@Currency", request.Money);
                    return await sqlConnection.QueryAsync<DebitAgeViewodel>(
                       "Book_DebitAge", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
               
            }
        }
    }
}
