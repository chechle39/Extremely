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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;
        public PermissionServiceDapper(IHttpContextAccessor httpContextAccessor, IFunctionsRepository functionsRepository, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _functionsRepository = functionsRepository;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }
        public async Task<IEnumerable<PermissionViewModel>> GetAppFncPermission(long userId, AppUserCommon userCommon)
        {
            using (var sqlConnection = new SqlConnection(userCommon.ConnectionString))
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
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
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
