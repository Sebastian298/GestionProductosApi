$(document).ready(function () {
    productID.style.display = 'none'
    getProducts();
    $('#brandSelect').select2({
        ajax: {
            global: false,
            contentType: "application/json",
            url: 'Brands/GetBrand',
            type: "GET",
            data: function (params) {
                return {
                    Name: params.term
                }
            },
            processResults: function (data, params) {
                let result = [];
                data = JSON.parse(data)
                if (data.Content != null && data.Success) {
                    var response = data.Content;
                    $.each(response, function (i, item) {
                        result.push({
                            id: response[i].BrandID,
                            text: response[i].Name
                        });
                    });
                    return { results: result }
                }
                else {
                    toastr.error(data.Description);
                }
            }

        },
        placeholder: 'BUSCAR MARCA',
        minimumInputLength: 3,
        language: {
            inputTooShort: function (args) {
                return "FAVOR DE INTRODUCIR " + args.minimum + " O MAS CARACTERES";
            },
            searching: function () {
                return "Buscando...";
            },
            noResults: function () {
                return "No se han encontrado resultados";
            }
        }
    });
    $('#categorySelect').select2({
        ajax: {
            global: false,
            contentType: "application/json",
            url: 'Categorys/GetCategory',
            type: "GET",
            data: function (params) {
                return {
                    Name: params.term
                }
            },
            processResults: function (data, params) {
                let result = [];
                data = JSON.parse(data)
                if (data.Content != null && data.Success) {
                    var response = data.Content;
                    $.each(response, function (i, item) {
                        result.push({
                            id: response[i].CategoryID,
                            text: response[i].Name
                        });
                    });
                    return { results: result }
                }
                else {
                    toastr.error(data.Description);
                }
            }

        },
        placeholder: 'BUSCAR CATEGORIA',
        minimumInputLength: 3,
        language: {
            inputTooShort: function (args) {
                return "FAVOR DE INTRODUCIR " + args.minimum + " O MAS CARACTERES";
            },
            searching: function () {
                return "Buscando...";
            },
            noResults: function () {
                return "No se han encontrado resultados";
            }
        }
    });
});

function getProducts() {
    let url = "Products/GetProducts";
    let html = ``;
    const options = {
        method: "GET"
    }
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            $('#tableProducts').DataTable().clear().destroy();
            bodyProduct.innerHTML = ``;
            if (data.Success == false) {
                toastr.error(data.Description);
                bodyProduct.innerHTML += html;
                $('#tableProducts').DataTable();
                return;
            } else {
                data.Content.forEach((res) => {
                    html += `
                   <tr>
                       <td>${res.Name}</td>
                       <td>${res.Brand}</td>
                       <td>${res.Category}</td>
                       <td>${res.Price}</td>
                       <td>${res.Sku}</td>
                       <td><img src="${res.Image}" class="img-responsive" width="50" height="50"/></td>
                       <td><a><i class="far fa-edit" data-toggle="modal" data-target="#modalEdit" onclick="writeData('${res.ProductID}','${res.Name}','${res.Brand}','${res.Category}','${res.Sku}','${res.Image}','${res.Price}')"></i></a></td>
                   </tr>`
                })
                bodyProduct.innerHTML += html;
                $('#tableProducts').DataTable();
            }

        })
}

function addProduct() {
    if (productName.value != '') {
        let objProduct = {
            Name: productName.value,
            Brand: parseInt(brandSelect.value),
            Category: parseInt(categorySelect.value),
            Price: parseFloat(productPrice.value),
            Sku: productSKU.value,
            Image: productImage.value
        };
        objProduct = JSON.stringify(objProduct);
        fetch("Products/AddProduct", {
            method: "POST",
            body: objProduct,
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(response => response.json())
            .then(data => {
                data = JSON.parse(data);
                console.log(data)
                if (data.Success == true) {
                    Swal.fire({
                        icon: 'success',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalAdd').modal('hide');
                        getProducts();
                        productName.value = '';
                        productPrice.value = '';
                        brandSelect.value = '';
                        categorySelect.value = '';
                        productSKU.value = '';
                        productImage.value = '';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalAdd').modal('hide');
                        productName.value = '';
                        productPrice.value = '';
                        brandSelect.value = '';
                        categorySelect.value = '';
                        productSKU.value = '';
                        productImage.value = '';
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de producto`
        });
    }
}

function editProduct() {
    if (editProductName.value != '') {
        let objProduct = {
            ProductID: productID.value,
            Name: editProductName.value,
            Price: editProductPrice.value,
            Sku: editProductSku.value,
            Image: editProductImage.value
        };
        objProduct = JSON.stringify(objProduct);
        fetch("Products/UpdateProduct", {
            method: "POST",
            body: objProduct,
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(response => response.json())
            .then(data => {
                data = JSON.parse(data);
                if (data.Success == true) {
                    Swal.fire({
                        icon: 'success',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalEdit').modal('hide');
                        getProducts();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalEdit').modal('hide');
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de producto`
        });
    }
}

function writeData(ProductID, Name, Brand, Category, Sku, Image, Price) {
    productID.value = ProductID;
    editProductName.value = Name;
    editProductBrand.value = Brand;
    editProductCategory.value = Category;
    editProductSku.value = Sku;
    editProductImage.value = Image;
    editProductPrice.value = Price;
}

function validar() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Estas seguro(a)?',
        text: "Los datos del producto seran editados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡Editar!',
        cancelButtonText: 'No, 	¡Cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            editProduct();
        } else {
            $('#modalEdit').modal('hide');
        }
    })
}