$(document).ready(function () {
    categoryID.style.display = 'none'
    getCategorys();
});

function getCategorys() {
    let url = "Categorys/GetCategorys";
    let html = ``;
    const options = {
        method: "GET"
    }
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            $('#tableCategory').DataTable().clear().destroy();
            bodyCategorys.innerHTML = ``;
            if (data.Title == 'Unauthorized') {
                Swal.fire({
                    icon: 'error',
                    text: `${data.Description}`
                }).then(() => {
                    bodyCategorys.innerHTML += html;
                    $('#tableCategory').DataTable();
                    return;
                })
            } else {
                data.Content.forEach((res) => {
                    html += `
                   <tr>
                   <td>${res.Name}</td>
                   <td><img src="${res.Image}" class="img-responsive" width="50" height="50"/></td>
                   <td><a><i class="icon-pencil" data-toggle="modal" data-target="#modalEdit" onclick="writeData('${res.CategoryID}','${res.Name}','${res.Image}')"></i></a></td>
                `
                })
                bodyCategorys.innerHTML += html;
                $('#tableCategory').DataTable();
            }

        })
}

function addCategory() {
    if (categoryName.value != '') {
        let objCategory = {
            Name: categoryName.value,
            Image: categoryImage.value
        };
        objCategory = JSON.stringify(objCategory);
        fetch("Categorys/CreateCategory", {
            method: "POST",
            body: objCategory,
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
                        getCategorys();
                        categoryName.value = '';
                        categoryImage.value = '';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalAdd').modal('hide');
                        categoryName.value = '';
                        categoryImage.value = '';
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de categoria`
        });
    }
}

function editCategory() {
    if (categoryNameEdit.value != '') {
        let objCategory = {
            CategoryID: categoryID.value,
            Name: categoryNameEdit.value,
            Image: categoryImageEdit.value
        };
        objCategory = JSON.stringify(objCategory);
        fetch("Categorys/UpdateCategory", {
            method: "POST",
            body: objCategory,
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
                        getCategorys();
                        categoryNameEdit.value = '';
                        categoryImageEdit.value = '';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: `${data.Description}`
                    }).then(() => {
                        $('#modalEdit').modal('hide');
                        categoryNameEdit.value = '';
                        categoryImageEdit.value = '';
                    })
                }
            });
    } else {
        Swal.fire({
            icon: 'error',
            text: `Debe definir un nombre de categoria`
        });
    }
}

function writeData(CategoryID, Name, Image) {
    categoryID.value = CategoryID;
    categoryNameEdit.value = Name;
    categoryImageEdit.value = Image;
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
        text: "Los datos de la categoria seran editados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡Editar!',
        cancelButtonText: 'No, 	¡Cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            editCategory();
        } else {
            $('#modalEdit').modal('hide');
        }
    })
}