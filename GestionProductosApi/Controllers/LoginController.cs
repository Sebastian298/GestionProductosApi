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
        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("CompanyID") != null)
            {
                return RedirectToAction("Index", "Dashboard");
            }else
                return View();
        }

        public IActionResult ValidateLogin([FromBody] Company objCompany)
        {
            var url = "https://localhost:44326/api/companies/Validate";
            dynamic jsonRequest = new JObject();
            jsonRequest.Name = objCompany.Name;
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
                HttpContext.Session.SetString("CompanyName", objCompany.Name);
                var y = HttpContext.Session.GetString("CompanyID");
                return Json(resultContent.ToString());
            }
            else
                return Json(resultContent.ToString());
        }

        [HttpGet]
        public IActionResult DestroySession()
        {
            dynamic res = new JObject();
            res.Url = "../Login/Index";
            HttpContext.Session.Remove("CompanyID");
            HttpContext.Session.Remove("CompanyName");
            return Json(res);
        }

    }
}
