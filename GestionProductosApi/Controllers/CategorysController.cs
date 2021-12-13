using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class CategorysController : Controller
    {
        static HttpClient http = new HttpClient();
        private IConfiguration Configuration { get; }
        public CategorysController()
        {
            Configuration = configuration;
            http.DefaultRequestHeaders.Clear();
            http.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", Configuration["Authorization:Token"]);
        }
        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("CompanyID") is null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
                return View();
        }
        [HttpGet]
        public IActionResult GetCategorys()
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = $"https://localhost:44326/api/categories/GetCategorys/{CompanyID}";
            var result = http.GetAsync(url).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            dynamic res = JsonConvert.DeserializeObject(resultContent);
            res = JObject.Parse(res.ToString());
            return Json(res);
        }
    }
}
