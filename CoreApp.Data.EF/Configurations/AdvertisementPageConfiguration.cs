using CoreApp.Data.EF.Extensions;
using CoreApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApp.Data.EF.Configurations
{
    public class AdvertisementPageConfiguration : DbEntityConfiguration<AdvertisementPage>
    {
        public override void Configure(EntityTypeBuilder<AdvertisementPage> entity)
        {
            entity.Property(c => c.Id).HasMaxLength(20).IsRequired().HasColumnType("varchar(20)");
            // etc.
        }
    }
}
