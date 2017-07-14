using System;
using System.Collections.Generic;

using StubHubScraper.Core.Data;

namespace StubHubScraper.Data.Domain
{
    public partial class ExecuteSearch: BaseEntity
    {
        public int SearchId { get; set; }
        public DateTime DateTime { get; set; }
    }
}
