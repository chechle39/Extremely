using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    public class UserRolesRepository: Repository<AppUserRoles>, IUserRolesRepository
    {
        private readonly IUnitOfWork _uow;
        public UserRolesRepository(DbContext context, IUnitOfWork uow) : base(context)
        {
            _uow = uow;
        }

        public async Task<bool> RemoveUserRole(AppUserRoleModel request)
        {
            var removeUserRole = new AppUserRoles()
            {
                RoleId = request.RoleId,
                UserId = request.UserId,
            };
            try
            {
                Entities.Remove(removeUserRole);

            }
            catch (Exception ex)
            {

            }
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }
    }
}
