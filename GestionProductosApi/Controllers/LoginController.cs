using GestionProductosApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class LoginController : Controller
    {
        static HttpClient http = new HttpClient();
        private readonly ILogger<LoginController> _logger;
        const string SessionCompanyID = "_CompanyID";
        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ValidateLogin([FromBody] Company objCompany)
        {
            var url = "https://localhost:44326/api/companies/Validate";
            dynamic jsonRequest = new JObject();
            jsonRequest.CompanyCode = objCompany.CompanyCode;
            jsonRequest.Email = objCompany.Email;
            jsonRequest.Password = objCompany.Password;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PostAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            if (result.StatusCode == System.Net.HttpStatusCode.Accepted)
            {
                resultContent = JObject.Parse(resultContent);
                var x = resultContent.Content.CompanyID.ToString();
                string CompanyID = x.ToString();
                HttpContext.Session.SetString("CompanyID",CompanyID);
                var y = HttpContext.Session.GetString("CompanyID");
                return Json(resultContent.ToString());
            }
            else
                return Json(resultContent.ToString());
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
