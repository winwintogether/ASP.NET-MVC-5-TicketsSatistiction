using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

using StubHubScraper.Core;
using StubHubScraper.Core.Data;
using StubHubScraper.Data;
using StubHubScraper.Data.Domain;

namespace StubHubScraper.Services
{
    public partial class ExecuteSearchService: IExecuteSearchService
    {
        private readonly IApplicationRepository<ExecuteSearch> _quickExecuteSearchRepository;
        public ExecuteSearchService(IApplicationRepository<ExecuteSearch> quickExecuteSearchRepository) {
            this._quickExecuteSearchRepository = quickExecuteSearchRepository;
        }
        public DateTime GetLastSuccessfulDate() {
            return _quickExecuteSearchRepository.Table.Select(x => x.DateTime).Distinct().Max();
        }
        public void InsertExecuteSearch(ExecuteSearch executeSearchItem) {
            _quickExecuteSearchRepository.Insert(executeSearchItem);
        }
    }
}
