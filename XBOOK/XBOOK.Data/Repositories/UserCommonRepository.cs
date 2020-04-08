using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base.XBookContextCommon;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;

namespace XBOOK.Data.Repositories
{
    public class UserCommonRepository : Repository<AppUserCommon>, IUserCommonRepository
    {
        public UserCommonRepository(XBookComonContext context) : base(context)
        {
        }
        public async Task<AppUserCommon> FindUserCommon(string email)
        {
            var data = await Entities.Where(x => x.Email == email).ToListAsync();
            if (data.Count > 0)
            {
                var result = new AppUserCommon()
                {
                    Code = data[0].Code,
                    Email = data[0].Email,
                    ConnectionString = data[0].ConnectionString
                };
                return result;
            } else
            {
                return null;
            }
            
        }
    }
}
