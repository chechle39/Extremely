using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class JournalEntryRepository : Repository<JournalEntry>, IJournalEntryRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IClientRepository _clientRepository;
        private readonly ISupplierRepository _supplierRepository;
        public JournalEntryRepository(DbContext context, IUnitOfWork uow, IClientRepository clientRepository, ISupplierRepository supplierRepository) : base(context)
        {
            _uow = uow;
            _clientRepository = clientRepository;
            _supplierRepository = supplierRepository;
        }
        public async Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry()
        {
            var data = await Entities.ProjectTo<JournalEntryViewModel>().ToListAsync();
            return data;
        }

        public async Task<List<JournalEntryEmployeeViewModel>> GetDataMap()
        {
            var dataMap = new List<JournalEntryEmployeeViewModel>();
            var supplier = await _supplierRepository.GetAllSupplier();

            var client = await _clientRepository.GetAllClientData();
            foreach (var item in client)
            {
                var data = new JournalEntryEmployeeViewModel()
                {
                    ID = item.ClientId,
                    ObjectName = item.ClientName,
                    ObjectType = "Client"
                };
                dataMap.Add(data);
            }

            foreach(var item in supplier)
            {
                var data = new JournalEntryEmployeeViewModel()
                {
                    ID = item.supplierID,
                    ObjectName = item.supplierName,
                    ObjectType = "Supplier"
                };
                dataMap.Add(data);
            }
            return dataMap;
        }
    }
}
