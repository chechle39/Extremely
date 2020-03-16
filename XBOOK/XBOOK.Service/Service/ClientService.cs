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
    public class ClientService : IClientService
    {
        private readonly IRepository<Client> _clientUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IClientRepository _iClientRepository;
        private readonly XBookContext _context;

        public ClientService(IUnitOfWork uow, XBookContext context, IClientRepository iClientRepository)
        {
            _uow = uow;
            _clientUowRepository = _uow.GetRepository<IRepository<Client>>();
            _context = context;
            _iClientRepository = iClientRepository;
        }
        public Client CreateClient(ClientCreateRequet request)
        {
            var clientCreate = Mapper.Map<ClientCreateRequet, Client>(request);
            var client = new Client()
            {
                clientID = 0,
                address = request.Address,
                clientName = request.ClientName,
                contactName = request.ContactName,
                email = request.Email,
                note = request.Note,
                Tag = request.Tag,
                taxCode = request.TaxCode,
                bankAccount = request.BankAccount
            };
            _clientUowRepository.AddData(client);
            _uow.SaveChanges();
            return client;
        }

         public bool CreateClientImport(List<ClientCreateRequet> request)
        {
            var clientCreate = Mapper.Map<List<ClientCreateRequet>, List<Client>>(request);
            foreach (var item in request) {
                var client = new Client()
                {
                    clientID = 0,
                    address = item.Address,
                    clientName = item.ClientName,
                    contactName = item.ContactName,
                    email = item.Email,
                    note = item.Note,
                    Tag = item.Tag,
                    taxCode = item.TaxCode,
                    bankAccount = item.BankAccount
                };
                _clientUowRepository.AddData(client);
                _uow.SaveChanges();               
            }
            return true;
        }

        public bool DeletedClient(List<requestDeleted> request)
        {
            foreach(var item in request)
            {
                _iClientRepository.remiveClient(item.id);
            }
            _uow.SaveChanges();

            return true;
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClient(ClientSerchRequest request)
        {
            var data = await _iClientRepository.GetAllClientAsync(request);
            return data;
        }

        public async Task<ClientViewModel> GetClientById(int id)
        {
            var dataList = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToListAsync();
            return dataList[0];
        }

        public async Task<IEnumerable<ClientViewModel>> SerchClient(string keyword)
        {
            var lisClient = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
            var listWhere = lisClient.Where(x => x.ClientName == keyword).ToList();
            return listWhere;
        }

        public async Task<bool> UpdateClient(ClientCreateRequet request)
        {
            var clientCreate = Mapper.Map<ClientCreateRequet, Client>(request);
            await _clientUowRepository.Update(clientCreate);
            return true;
        }
        public byte[] GetDataClientAsync(List<ClientCreateRequet> request)
        {
            var comlumHeadrs = new string[]
            {
                "ClientId",
                "ClientName",
                "Address",
                "TaxCode",
                "Tag",
                "ContactName",
                "Email",
                "Note",
                "bankAccount",
            };
            var listGen = new List<ClientCreateRequet>();

            listGen = request;

            var csv = (from item in listGen
                       select new object[]
                       {
                          item.ClientID,
                          item.ClientName,
                          item.Address,
                          item.TaxCode,
                          item.Tag,
                          item.ContactName,
                          item.Email,
                          item.Note,
                          item.BankAccount
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

