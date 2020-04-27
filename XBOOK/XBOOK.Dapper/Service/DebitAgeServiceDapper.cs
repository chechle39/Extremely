using Dapper;
using Microsoft.AspNetCore.Http;
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
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserCommonRepository _userCommonRepository;
        public DebitAgeServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserCommonRepository userCommonRepository)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<IEnumerable<DebitAgeViewodel>> GetDebitageServiceDapperAsync(DebitageModelSearchRequest request)
        {
            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
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
