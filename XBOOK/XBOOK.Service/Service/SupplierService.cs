using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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

        public  bool CreateSupplier(SupplierCreateRequest request)
        {            
            try
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
                return true;
            }
            catch (DbUpdateException ex)
            {
                SqlException innerException = ex.InnerException as SqlException;
                if (innerException != null && (innerException.Number == 2627 || innerException.Number == 2601))
                {
                    return false;
                }
                else
                {
                    return true;
                }

            }


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

        public async Task<bool> UpdateSupplierAsync(SupplierCreateRequest request)
        {
            try
            {
                var clientCreate = Mapper.Map<SupplierCreateRequest, Supplier>(request);
                await _supUowRepository.Update(clientCreate);
                return true;
            }
            catch (DbUpdateException ex)
            {
                SqlException innerException = ex.InnerException as SqlException;
                if (innerException != null && (innerException.Number == 2627 || innerException.Number == 2601))
                {
                    return false;
                }
                else
                {
                    return true;
                }

            }

        }
        public bool CreateSupplierImport(List<SupplierCreateRequest> request)
        {
            var clientCreate = Mapper.Map<List<SupplierCreateRequest>, List<Supplier>>(request);
            foreach (var item in request)
            {
                var lisSupplier = _supUowRepository.GetAll().ProjectTo<SupplierViewModel>().ToListAsync().Result;
                var listWhere = lisSupplier.Where(x => x.supplierName == item.supplierName).ToList();
                if (listWhere.Count <= 0)
                {
                    var supplier = new Supplier()
                    {
                        supplierID = 0,
                        address = item.Address,
                        supplierName = item.supplierName,
                        contactName = item.ContactName,
                        email = item.Email,
                        note = item.Note,
                        Tag = item.Tag,
                        taxCode = item.TaxCode,
                        bankAccount = item.bankAccount
                    };
                    _supUowRepository.AddData(supplier);
                    _uow.SaveChanges();
                }
                   
            }
            return true;
        }
        public byte[] GetDataSupplierAsync(List<SupplierCreateRequest> request)
        {
            var comlumHeadrs = new string[]
            {
                "supplierID",
                "supplierName",
                "address",
                "taxCode",
                "Tag",
                "contactName",
                "email",
                "note",
                "bankAccount",
            };
            var listGen = new List<SupplierCreateRequest>();

            listGen = request;

            var csv = (from item in listGen
                       select new object[]
                       {
                          item.supplierID,
                          item.supplierName,
                          item.Address,
                          item.TaxCode,
                          item.Tag,
                          item.ContactName,
                          item.Email,
                          item.Note,
                          item.bankAccount
                       }).ToList();
            var csvData = new StringBuilder();

            csv.ForEach(line =>
            {
                csvData.AppendLine(string.Join(",", line));
            });
            byte[] buffer = Encoding.UTF8.GetBytes($"{string.Join(",", comlumHeadrs)}\r\n{csvData.ToString()}");
            return buffer;

        }
    }
}
