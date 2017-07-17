﻿using StubHubScraper.Data.Domain;
using System.Collections.Generic;
using System.Linq;
using System;

namespace StubHubScraper.Services
{
    public partial interface IExecuteSearchService
    {
        String GetLastSuccessfulDate();
        void InsertExecuteSearch(ExecuteSearch executeSearchItem);
    }
}
