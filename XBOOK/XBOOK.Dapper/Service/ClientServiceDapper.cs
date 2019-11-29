using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class ClientServiceDapper : IClientServiceDapper
    {
        private readonly IConfiguration _configuration;
        public ClientServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<IEnumerable<ClientViewModel>> GetClientAsync(ClientSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                var now = DateTime.Now;

                var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);
                var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

                dynamicParameters.Add("@searchString", request.ClientKeyword);

                try
                {
                    return await sqlConnection.QueryAsync<ClientViewModel>(
                        "GetClientList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            throw new NotImplementedException();
        }
    }
}
