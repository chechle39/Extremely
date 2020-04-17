using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class PermissionServiceDapper : IPermissionDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PermissionServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public async Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId, string code)
        {
            var connectionString = code;
            using (SqlConnection myCon = new SqlConnection(connectionString))
            using (var sqlConnection = new SqlConnection(connectionString))
            {

                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@UserId", userId);
                return await sqlConnection.QueryAsync<PermissionViewModel>("GetPermissions", dynamicParameters, commandType: CommandType.StoredProcedure);

            }
        }
    }
}
