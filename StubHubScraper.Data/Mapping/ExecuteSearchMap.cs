using System;
using System.Data.Entity.ModelConfiguration;
using System.ComponentModel.DataAnnotations.Schema;
using StubHubScraper.Data.Domain;

namespace StubHubScraper.Data.Mapping
{
    public partial class ExecuteSearchMap : EntityTypeConfiguration<ExecuteSearch>
    {
        public ExecuteSearchMap()
        {
            this.ToTable("ExecuteSearches");
            this.HasKey(x => x.Id);
        }
    }
}
