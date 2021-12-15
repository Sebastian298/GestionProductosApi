$(document).ready(function () {
    brandID.style.display = 'none'
    getBrands();
});

function getBrands() {
    let url = "Brands/GetBrands";
    let html = ``;
    const options = {
        method: "GET"
    }
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            $('#example').DataTable().clear().destroy();
            bodyBrands.innerHTML = ``;
            if (data.Success == false) {
                Swal.fire({
                    icon: 'error',
                    text: `${data.Description}`
                }).then(() => {
                    bodyBrands.innerHTML += html;
                    $('#example').DataTable();
                    return;
                })
            } else {
                data.Content.forEach((res) => {
                    html += `
                   <tr>
                   <td>${res.Name}</td>
                   <td><img src="${res.Image}" class="img-responsive" width="50" height="50"/></td>
                   <td><a><i class="far fa-edit" data-toggle="modal" data-target="#modalEdit" onclick="writeData('${res.BrandID}','${res.Name}','${res.Image}')"></i></a></td>
                `
                })
                bodyBrands.innerHTML += html;
                $('#example').DataTable();
            }
            
        })
}

function addBrand() {
    if (brandName.value != '') {
        let objBrand = {
            Name: brandName.value,
            Image: brandImage.value
        };
        objBrand = JSON.stringify(objBrand);
        fetch("Brands/CreateBrand", {
            method: "POST",
            body: objBrand,
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
                        getBrands();
                        brandName.value = '';
                        brandImage.value = '';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalAdd').modal('hide');
                        brandName.value = '';
                        brandImage.value = '';
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de marca`
        });
    }
}

function editBrand() {
    if (brandNameEdit.value != '') {
        let objBrand = {
            BrandID: brandID.value,
            Name: brandNameEdit.value,
            Image: brandImageEdit.value
        };
        objBrand = JSON.stringify(objBrand);
        fetch("Brands/UpdateBrand", {
            method: "POST",
            body: objBrand,
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
                        getBrands();
                        brandNameEdit.value = '';
                        brandImageEdit.value = '';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalEdit').modal('hide');
                        brandNameEdit.value = '';
                        brandImageEdit.value = '';
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de marca`
        });
    }
}

function writeData(BrandID, Name, Image) {
    brandID.value = BrandID;
    brandNameEdit.value = Name;
    brandImageEdit.value = Image;
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
        text: "Los datos de la marca seran editados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡Editar!',
        cancelButtonText: 'No, 	¡Cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            editBrand();
        } else {
            $('#modalEdit').modal('hide');
        }
    })
}