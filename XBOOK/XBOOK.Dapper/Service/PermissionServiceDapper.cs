using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
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
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@UserId", userId);

                return await sqlConnection.QueryAsync<PermissionViewModel>("GetPermissions", dynamicParameters, commandType: CommandType.StoredProcedure);

            }
        }
    }
}
