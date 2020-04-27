using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Dapper.Service
{
    public class PermissionServiceDapper : IPermissionDapper
    {
        private readonly IFunctionsRepository _functionsRepository;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PermissionServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IFunctionsRepository functionsRepository)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _functionsRepository = functionsRepository;
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

        public async Task<List<MenuModel>> GetMenu(long userId)
        {
            var listMenu = await _functionsRepository.GetAllFunction();
            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@UserId", userId);
                var permisssion = await sqlConnection.QueryAsync<PermissionViewModel>("GetPermissions", dynamicParameters, commandType: CommandType.StoredProcedure);
                var dataMenuList = new List<MenuModel>();
                var join = from menu in listMenu
                           join per in permisssion
                           on menu.Id equals per.FunctionId
                           where per.Read = true
                           select (menu);
                var menuData = join.ToList();

                foreach (var item in menuData.Where(x => x.ParentId == null))
                {
                    var children = new List<children>();
                    foreach (var item2 in menuData.Where(x => x.ParentId == item.Id))
                    {
                        var child = new children()
                        {
                            link = item2.URL,
                            title = item2.Name,
                            SortOrder = item2.SortOrder
                        };
                        children.Add(child);

                    }
                    var menuModel = new MenuModel()
                    {
                        icon = item.IconCss,
                        title = item.Name,
                        link = item.URL,
                        SortOrder = item.SortOrder,
                        children = children.OrderBy(x => x.SortOrder).ToList()
                    };
                    dataMenuList.Add(menuModel);
                }

                foreach (var item in dataMenuList.ToList())
                {
                    if (item.children.Count() == 0 && item.link == "/")
                    {
                        dataMenuList.Remove(item);
                    }
                }
                return dataMenuList.OrderBy(x => x.SortOrder).ToList();
            }
        }
    }
}
