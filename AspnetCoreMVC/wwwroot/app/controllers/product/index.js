var productController = function () {
    this.initialize = function () {
        loadData(false);
        registerEvents();
    }

    function registerEvents() {

        $('#ddlPageSize').on('change', function () {
            console.log("change");
            coreapp.configs.pageSize = $(this).val();
            coreapp.configs.pageNo = 1;

            console.log(coreapp.configs.pageNo);
            console.log(coreapp.configs.pageSize);
            loadData(true);
        })
    }

    function loadData(isPageSizeChanged) {
        var template = $('#tbl_template').html();
        var render = "";
        $.ajax({
            type: 'GET',
            url: '/Admin/Product/GetAllPaging',
            data: {
                categoryId: null,
                keyword: $('#txtKeyword').val(),
                pageNo: coreapp.configs.pageIndex,
                pageSize: coreapp.configs.pageSize
            },
            dataType: 'json',
            success: function (response) {
                $.each(response.Results, function (index, item) {
                    render += Mustache.render(template, {
                        Id: item.Id,
                        Name: item.Name,
                        ImageUrl: item.ImageUrl == null ? '<img src="/admin-site/images/user1-128x128.jpg" width=25 />' : '<img src="' + item.ImageUrl + '" width=25 />',
                        CategoryName: item.ProductCategory.Name,
                        Price: coreapp.formatNumber(item.Price, 0),
                        CreatedDate: coreapp.formatDateTimeJson(item.CreatedDate),
                        Status: coreapp.getStatus(item.Status)
                    });
                });
                $('#lblTotalRecords').text(response.RowCount);
                if (render != '') {
                    $('#tbl_content').html(render);
                }
                wrapPaging(response.RowCount, function () {
                    loadData(false);
                }, isPageSizeChanged)
            },
            error: function (status) {
                console.log(status);
                coreapp.notify("Cannot load product", "error")
            }
        });
    }

    function wrapPaging(recordCount, callBack, isPageSizeChanged) {
        var totalSize = Math.ceil(recordCount / coreapp.configs.pageSize);
        if ($('#paginationUL a').length === 0 || isPageSizeChanged === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }

        $('#paginationUL').twbsPagination({
            totalPages: totalSize,
            visiblePages: 7,
            first: "Đầu",
            prev: "Trước",
            next: "Tiếp",
            last: "Cuối",
            onPageClick: function (event, p) {
                coreapp.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
    }

}