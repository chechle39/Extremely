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
        }
    }
}
