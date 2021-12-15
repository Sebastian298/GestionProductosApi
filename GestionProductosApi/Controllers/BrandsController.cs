using GestionProductosApi.Models;
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
using System.Text;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class BrandsController : Controller
    {
        static HttpClient http = new HttpClient();
        private IConfiguration Configuration { get; }
        public BrandsController(IConfiguration configuration)
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
            {
                return View();
            }
        }

        [HttpGet]
        public IActionResult GetBrands()
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = $"http://sebastiantenorio-001-site1.ctempurl.com/api/brands/GetBrands/{CompanyID}";
            var result = http.GetAsync(url).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            dynamic res = JsonConvert.DeserializeObject(resultContent);
            res = JObject.Parse(res.ToString());
            return Json(res);
        }

        [HttpGet]
        public IActionResult GetBrand(string Name)
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = "http://sebastiantenorio-001-site1.ctempurl.com/api/brands/GetBrand";
            dynamic jsonRequest = new JObject();
            jsonRequest.CompanyID = CompanyID;
            jsonRequest.Name = Name;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PostAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            return Json(resultContent.ToString());
        }

        [HttpPost]
        public IActionResult CreateBrand([FromBody] Brand objBrand)
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = "http://sebastiantenorio-001-site1.ctempurl.com/api/brands/Create";
            dynamic jsonRequest = new JObject();
            jsonRequest.Name = objBrand.Name;
            jsonRequest.Image = objBrand.Image;
            jsonRequest.CompanyID = CompanyID;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PostAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            return Json(resultContent.ToString());
        }

        [HttpPost]
        public IActionResult UpdateBrand([FromBody] Brand objBrand)
        {
            var url = "http://sebastiantenorio-001-site1.ctempurl.com/api/brands/Update";
            dynamic jsonRequest = new JObject();
            jsonRequest.BrandID = objBrand.BrandID;
            jsonRequest.Name = objBrand.Name;
            jsonRequest.Image = objBrand.Image;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PutAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            return Json(resultContent.ToString());
        }
    }
}
