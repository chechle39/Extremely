using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
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
                
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();               
                    dynamicParameters.Add("@Date", request.Date);
                    dynamicParameters.Add("@Currency", request.Currency);
                    return await sqlConnection.QueryAsync<DebitAgeViewodel>(
                       "Book_DebitAge", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
               
            }
        }
    }
}
