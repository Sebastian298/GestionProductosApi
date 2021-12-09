using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class BrandsController : Controller
    {
        static HttpClient http = new HttpClient();
        public IConfiguration Configuration { get; }
        public BrandsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetBrands()
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = $"https://localhost:44326/api/brands/GetBrands/{CompanyID}";
            http.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", Configuration["Authorization:Token"]);
            var result = http.GetAsync(url).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            dynamic res = JsonConvert.DeserializeObject(resultContent);
            res = JObject.Parse(res.ToString());
            return Json(res);
        }
    }
}
