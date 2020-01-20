using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class SupplierService : ISupplierService
    {
        private readonly IUnitOfWork _uow;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IRepository<Supplier> _supUowRepository;

        public SupplierService(IUnitOfWork uow, ISupplierRepository supplierRepository)
        {
            _uow = uow;
            _supplierRepository = supplierRepository;
            _supUowRepository = _uow.GetRepository<IRepository<Supplier>>();
        }

        public async Task<bool> CreateSupplier(SupplierCreateRequest request)
        {
            var sup = new Supplier()
            {
                supplierID = 0,
                address = request.Address,
                supplierName = request.supplierName,
                contactName = request.ContactName,
                email = request.Email,
                note = request.Note,
                Tag = request.Tag,
                taxCode = request.TaxCode,
                bankAccount = request.bankAccount
            };
             _supUowRepository.AddData(sup);
            _uow.SaveChanges();
            return await Task.FromResult(true);

        }

        public async Task<bool> DeletedSupplier(List<requestDeleted> request)
        {
            foreach (var item in request)
            {
                try
                {
                    _supplierRepository.removeSupplier(item.id);

                }catch (Exception ex)
                {

                }
            }

            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<SupplierViewModel>> GetAllSupplier(ClientSerchRequest request)
        {
            var data = await _supplierRepository.GetAllSupplierAsync(request);
            return data;
        }

        public async Task<SupplierViewModel> GetSupplierById(int id)
        {
            var dataList = await _supUowRepository.GetAll().ProjectTo<SupplierViewModel>().Where(x => x.supplierID == id).ToListAsync();
            return dataList[0];
        }

        public Task<IEnumerable<SupplierViewModel>> SerchClient(string keyword)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateSupplier(SupplierCreateRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
