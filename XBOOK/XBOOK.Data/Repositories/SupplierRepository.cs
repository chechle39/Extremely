using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class SupplierRepository : Repository<Supplier>, ISupplierRepository
    {
        private readonly IUnitOfWork _uow;

        public SupplierRepository(XBookContext context, IUnitOfWork uow) : base(context)
        {
            _uow = uow;
        }
        public async Task<Supplier> CreateSupplier(SupplierCreateRequest request)
        {
            var supplierCreate = Mapper.Map<SupplierCreateRequest, Supplier>(request);
            await Entities.AddAsync(supplierCreate);
            return supplierCreate;
        }

        public async Task<IEnumerable<SupplierViewModel>> GetAllSupplier()
        {
            var listData = await Entities.ProjectTo<SupplierViewModel>().ToListAsync();
            return listData;
        }
        public async Task<SupplierViewModel> GetSupplierBySupplierName(string supplierName)
        {
            var data = await Entities.Where(supplier => supplier.supplierName == supplierName).ProjectTo<SupplierViewModel>().AsNoTracking().FirstOrDefaultAsync();
            return data;
        }

        public async Task<IEnumerable<SupplierViewModel>> GetAllSupplierAsync(ClientSerchRequest request)
        {
            var listData = new List<SupplierViewModel>();
            if (!string.IsNullOrEmpty(request.ClientKeyword))
            {
                var keyWord = "%" + request.ClientKeyword + "%";
                var data = from c in Entities
                           where EF.Functions.Like(c.supplierName, keyWord) || EF.Functions.Like(c.address, keyWord) || EF.Functions.Like(c.email, keyWord) || EF.Functions.Like(c.taxCode, keyWord)
                           select c;
                listData = await data.ProjectTo<SupplierViewModel>().Take(20).ToListAsync();
            }
            else if (string.IsNullOrEmpty(request.ClientKeyword))
            {
                listData = await Entities.ProjectTo<SupplierViewModel>().Take(20).ToListAsync();
            }
            return listData;
        }

        public async Task<string> GetSupplierByID(long? id)
        {
            var listData = await Entities.ProjectTo<SupplierViewModel>().Where(x=>x.supplierID == id).ToListAsync();
            return listData[0].address;
        }

        public bool removeSupplier(long id)
        {
            var ListClient = Entities.Where(x => x.supplierID == id).ToList();
             Entities.Remove(ListClient[0]);
            _uow.SaveChanges();
            return true;
        }

        public async Task<bool> UpdateSupplier(SupplierCreateRequest request)
        {
            var supplierUpdate = Mapper.Map<SupplierCreateRequest, Supplier>(request);
            Entities.Update(supplierUpdate);
            return await Task.FromResult(true);
        }
    }
}
