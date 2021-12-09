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
        })
}

function writeData(BrandID, Name, Image) {
    brandID.value = BrandID;
    brandNameEdit.value = Name;
    brandImageEdit.value = Image;
}