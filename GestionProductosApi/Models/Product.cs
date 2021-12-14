using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestionProductosApi.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public int Brand { get; set; }
        public int Category { get; set; }
        public string Sku { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }
    }
}
