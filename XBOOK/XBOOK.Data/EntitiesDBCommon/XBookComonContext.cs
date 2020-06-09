using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.EntityConfigurations;

namespace XBOOK.Data.EntitiesDBCommon
{
    public class XBookComonContext : DbContext
    {
        protected readonly IConfiguration _configuration;

        public XBookComonContext(DbContextOptions<XBookComonContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }
        public virtual DbSet<AppUserCommon> AppUserCommon { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AppUserCommonConfiguration());

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnectionCommon");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
}
