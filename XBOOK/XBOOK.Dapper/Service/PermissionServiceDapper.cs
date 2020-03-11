using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class PermissionServiceDapper : IPermissionDapper
    {
        private readonly IConfiguration _configuration;
        public PermissionServiceDapper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId)
        {
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@UserId", userId);

                return await sqlConnection.QueryAsync<PermissionViewModel>("GetPermissions", dynamicParameters, commandType: CommandType.StoredProcedure);

            }
        }
    }
}
