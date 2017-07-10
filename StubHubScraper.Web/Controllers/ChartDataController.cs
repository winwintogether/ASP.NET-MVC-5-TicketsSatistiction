﻿using System;
using System.Linq;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Text.RegularExpressions;
using System.Net.Http;
using System.Web.Http;
using StubHubScraper.Web.Filters;
using StubHubScraper.Web.Models;

using StubHubScraper.Data.Domain;
using StubHubScraper.Services;

namespace StubHubScraper.Web.Controllers
{
    //[Authorize]
    public class ChartDataController : ApiController
    {
        private readonly IQuickSearchService _quickSearchService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger _logger;
        public ChartDataController(IQuickSearchService quickSearchService,
            ILogger logger,
            IAuthenticationService authenticationService)
        {
            this._quickSearchService = quickSearchService;
            this._authenticationService = authenticationService;
            this._logger = logger;
        }

        [Queryable]
        public IQueryable<ChartModel> GetEventChartData(int quickId, int chartduration)
        {
            var user = _authenticationService.GetAuthenticatedUser();
           
            var list=new List<ChartModel>();
            DateTime date = DateTime.Now.AddDays(-1*chartduration);
            var max = 0.0M;
            for(int i=0;i< chartduration; i++)
            {
                date = date.AddDays(1);
                decimal average=0;int sales=0;
                _quickSearchService.GetTicketsChartData(user.Id,quickId,date,out average,out sales);
                if (sales > 0)
                {
                    if (max < average) max = average;
                    //  list.Add(new ChartModel { average = average, volume = sales, date = date.ToString("M/d") });
                    list.Add(new ChartModel { average = average, volume = sales, date = date.ToString()});
                }
            }
            if (list.Count > 0)
            {
                max = Math.Ceiling(max / 10) * 10;
                var c = list.FirstOrDefault();
                c.max = max;
            }
            return list.AsQueryable();
        }

    }
}