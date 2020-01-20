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
    public class SupplierServiceDapper : ISupplierServiceDapper
    {
        private readonly IConfiguration _configuration;
        public SupplierServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<IEnumerable<SupplierViewModel>> GetSupplierAsync(ClientSerchRequest request)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@searchString", request.ClientKeyword);

                try
                {
                    return await sqlConnection.QueryAsync<SupplierViewModel>(
                        "GetSupplierList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}
