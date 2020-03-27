using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class DebitAgeServiceDapper : IDebitageServiceDapper
    {
        private readonly IConfiguration _configuration;
        public DebitAgeServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        
        
        public async Task<IEnumerable<DebitAgeViewodel>> GetDebitageServiceDapperAsync(DebitageModelSearchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
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
