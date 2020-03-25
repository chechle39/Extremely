using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;

namespace XBOOK.Data.Repositories
{
    public class UserRepository : Repository<AppUser>, IUserRepository
    {
        public UserRepository(XBookContext context) : base(context)
        {

        }
        public async Task<bool> checkUserAcount()
        {
            var getUser = await Entities.ToListAsync();
            if (getUser.Count() != 0)
            {
                return await Task.FromResult(true);
            } else
            {
                return await Task.FromResult(false);
            }
        }
    }
}
