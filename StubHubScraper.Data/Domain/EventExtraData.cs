using System;
using System.Collections.Generic;
using StubHubScraper.Core.Data;
namespace StubHubScraper.Data.Domain
{
    public partial class EventExtraData : BaseEntity
    {
        public int TotalTickets { get; set; }
        public decimal minTicketPrice { get; set; }
        public decimal averageTicketPrice { get; set; }

    }
}
