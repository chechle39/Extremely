using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.EntityConfigurations;

namespace XBOOK.Data.EntitiesDBCommon
{
    public class XBookComonContext : DbContext
    {
        public XBookComonContext(DbContextOptions<XBookComonContext> options) : base(options)
        {
        }
        public virtual DbSet<AppUserCommon> AppUserCommon { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AppUserCommonConfiguration());

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }
    }
}
