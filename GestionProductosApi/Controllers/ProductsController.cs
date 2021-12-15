using GestionProductosApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class ProductsController : Controller
    {
        static HttpClient http = new HttpClient();
        private IConfiguration Configuration { get; }
        public ProductsController(IConfiguration configuration)
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
        public IActionResult GetProducts()
        {
            var CompanyID = HttpContext.Session.GetString("CompanyID");
            var url = $"http://sebastiantenorio-001-site1.ctempurl.com/api/products/GetProducts/{CompanyID}";
            var result = http.GetAsync(url).Result;
            var resultContent = result.Content.ReadAsStringAsync().Result;
            dynamic res = JsonConvert.DeserializeObject(resultContent);
            res = JObject.Parse(res.ToString());
            return Json(res);
        }

        [HttpPost]
        public IActionResult AddProduct([FromBody] Product objProduct)
        {
            var CompanyID = int.Parse(HttpContext.Session.GetString("CompanyID"));
            var url = "http://sebastiantenorio-001-site1.ctempurl.com/api/products/Create";
            dynamic jsonRequest = new JObject();
            jsonRequest.Name = objProduct.Name;
            jsonRequest.Brand = objProduct.Brand;
            jsonRequest.Category = objProduct.Category;
            jsonRequest.CompanyID = CompanyID;
            jsonRequest.Price = objProduct.Price;
            jsonRequest.Sku = objProduct.Sku;
            jsonRequest.Image = objProduct.Image;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PostAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            return Json(resultContent.ToString());
        }

        public IActionResult UpdateProduct([FromBody] Product objProduct)
        {
            var url = "http://sebastiantenorio-001-site1.ctempurl.com/api/products/Update";
            dynamic jsonRequest = new JObject();
            jsonRequest.ProductID = objProduct.ProductID;
            jsonRequest.Name = objProduct.Name;
            jsonRequest.Price = objProduct.Price;
            jsonRequest.Sku = objProduct.Sku;
            jsonRequest.Image = objProduct.Image;
            var content = new StringContent(jsonRequest.ToString(), Encoding.UTF8, "application/json");
            var result = http.PutAsync(url, content).Result;
            dynamic resultContent = result.Content.ReadAsStringAsync().Result.ToString();
            return Json(resultContent.ToString());
        }
    }
}
