using System;
using System.Linq;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StubHubScraper.Web.Filters;
using StubHubScraper.Web.Models;

using StubHubScraper.Data.Domain;
using StubHubScraper.Services;
namespace StubHubScraper.Web.Controllers
{
    public class ExecuteSearchController : ApiController
    {
        private readonly IExecuteSearchService _executeSearchService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserService _userService;
        private readonly ILogger _logger;
        public ExecuteSearchController(IAuthenticationService authenticationService,
            ILogger logger,
            IUserService userService,
            IExecuteSearchService executeSearchService)
        {
            this._authenticationService = authenticationService;
            this._executeSearchService = executeSearchService;
            this._userService = userService;
            this._logger = logger;
        }

        [HttpGet]
        public string GetExecuteSearch()
        {
            var user = _authenticationService.GetAuthenticatedUser();
           
            string result = _executeSearchService.GetLastSuccessfulDate().ToString();

            return result;
        }


        public HttpResponseMessage Post(ExecuteSearch search)
        {
            var user = _authenticationService.GetAuthenticatedUser();
            try
            {
                StubHub.Login(user.ApiUserName, user.ApiPassword);
                var executesearch = new ExecuteSearch
                {
                    SearchId = search.SearchId,
                    DateTime = DateTime.Now
                };
                _executeSearchService.InsertExecuteSearch(executesearch);
            }
            catch (Exception ex)
            {
                _logger.InsertLog(new Log { UserId = user.Id, LogLevelId = 40, Message = ex.Message, CreatedOnUtc = DateTime.Now });
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
            var model = new { result = "success" };
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
            return response;
        }
    }
}
