using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionProductosApi.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            ViewData["CompanyID"] = HttpContext.Session?.GetString("CompanyID");
            return View();
        }
    }
}
