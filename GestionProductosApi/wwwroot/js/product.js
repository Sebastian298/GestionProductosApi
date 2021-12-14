$(document).ready(function () {
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
                var result = [];
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
                var result = [];
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