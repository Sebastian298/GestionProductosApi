// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function validateCompany(companyCode, email, password) {
    let companyID
    let objCompany = {
        CompanyCode: companyCode,
        Email: email,
        Password: password
    };
    objCompany = JSON.stringify(objCompany);
    fetch("Login/ValidateLogin", {
        method: "POST",
        body: objCompany,
        headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(response => response.json())
        .then(data => {
            let res = JSON.parse(data)
            console.log(res)
            if (res.Success == false) {
                Swal.fire({
                    icon: 'error',
                    title: res.Title,
                    text: res.Description,
                    footer: 'Verificar su información'
                })
            } else {
                let url = "Dashboard/Index";
                const options = {
                    method: "GET"
                };
                fetch(url, options).then(data => {
                    location.replace(data.url);
                });
            }
        })
}