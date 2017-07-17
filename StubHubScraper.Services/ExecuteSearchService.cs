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
        public string GetLastSuccessfulDate() {

            try {
                return _quickExecuteSearchRepository.Table.Select(x => x.DateTime).Distinct().Max().ToString();
            }
            catch (Exception ex) {
                return "Nothing";
            }


        }
        public void InsertExecuteSearch(ExecuteSearch executeSearchItem) {
            _quickExecuteSearchRepository.Insert(executeSearchItem);
        }
    }
}
