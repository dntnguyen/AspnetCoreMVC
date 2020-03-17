var productController = function () {
    this.initialize = function () {
        loadCategories();
        loadData(false);
        registerEvents();
    }

    function registerEvents() {
        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            //lang: 'en',
            rules: {
                txtNameM: { required: true },
                ddlCategoryIdM: { required: true },
                txtPriceM: {
                    required: true,
                    number: true
                },
                txtOriginalPriceM: {
                    required: true,
                    number: true
                }
            }
        });

        $('#ddlPageSize').on('change', function () {
            console.log("change");
            coreapp.configs.pageSize = $(this).val();
            coreapp.configs.pageNo = 1;

            loadData(true);
        })

        $('#btnSearch').on('click', function () {
            loadData(false);
        })

        $('#txtKeyword').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                loadData(false);
            }
        });

        $("#btnCreate").on('click', function () {
    
            resetFormMaintainance();
            initTreeDropDownCategory();
            $('#modalAddEdit').modal('show');

        });
        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            console.log(that);
            $.ajax({
                type: "GET",
                url: "/Admin/Product/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    coreapp.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidIdM').val(data.Id);
                    $('#txtNameM').val(data.Name);
                    initTreeDropDownCategory(data.CategoryId);

                    $('#txtDescM').val(data.Description);
                    $('#txtUnitM').val(data.Unit);

                    $('#txtPriceM').val(data.Price);
                    $('#txtOriginalPriceM').val(data.OriginalPrice);
                    $('#txtPromotionPriceM').val(data.PromotionPrice);

                    // $('#txtImageM').val(data.ThumbnailImage);

                    $('#txtTagM').val(data.Tags);
                    $('#txtMetakeywordM').val(data.SeoKeywords);
                    $('#txtMetaDescriptionM').val(data.SeoDescription);
                    $('#txtSeoPageTitleM').val(data.SeoPageTitle);
                    $('#txtSeoAliasM').val(data.SeoAlias);

                    //CKEDITOR.instances.txtContentM.setData(data.Content);
                    $('#ckStatusM').prop('checked', data.Status == 1);
                    $('#ckHotM').prop('checked', data.HotFlag);
                    $('#ckShowHomeM').prop('checked', data.HomeFlag);

                    $('#modalAddEdit').modal('show');
                    coreapp.stopLoading();

                },
                error: function (status) {
                    coreapp.notify('Có lỗi xảy ra', 'error');
                    coreapp.stopLoading();
                }
            });
        });
        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            coreapp.confirm('Are you sure to delete?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Product/Delete",
                    data: { id: that },
                    dataType: "json",
                    beforeSend: function () {
                        coreapp.startLoading();
                    },
                    success: function (response) {
                        coreapp.notify('Delete successful', 'success');
                        coreapp.stopLoading();
                        loadData();
                    },
                    error: function (status) {
                        coreapp.notify('Has an error in delete progress', 'error');
                        coreapp.stopLoading();
                    }
                });
            });
        });

        $('#btnSave').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = $('#hidIdM').val();
                var name = $('#txtNameM').val();
                var categoryId = $('#ddlCategoryIdM').combotree('getValue');

                var description = $('#txtDescM').val();
                var unit = $('#txtUnitM').val();

                var price = $('#txtPriceM').val();
                var originalPrice = $('#txtOriginalPriceM').val();
                var promotionPrice = $('#txtPromotionPriceM').val();

                //var image = $('#txtImageM').val();

                var tags = $('#txtTagM').val();
                var seoKeyword = $('#txtMetakeywordM').val();
                var seoMetaDescription = $('#txtMetaDescriptionM').val();
                var seoPageTitle = $('#txtSeoPageTitleM').val();
                var seoAlias = $('#txtSeoAliasM').val();

                //var content = CKEDITOR.instances.txtContentM.getData();
                var status = $('#ckStatusM').prop('checked') == true ? 1 : 0;
                var hot = $('#ckHotM').prop('checked');
                var showHome = $('#ckShowHomeM').prop('checked');

                $.ajax({
                    type: "POST",
                    url: "/Admin/Product/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        CategoryId: categoryId,
                        Image: '',
                        Price: price,
                        OriginalPrice: originalPrice,
                        PromotionPrice: promotionPrice,
                        Description: description,
                        Content: '',
                        HomeFlag: showHome,
                        HotFlag: hot,
                        Tags: tags,
                        Unit: unit,
                        Status: status,
                        SeoPageTitle: seoPageTitle,
                        SeoAlias: seoAlias,
                        SeoKeywords: seoKeyword,
                        SeoDescription: seoMetaDescription
                    },
                    dataType: "json",
                    beforeSend: function () {
                        coreapp.startLoading();
                    },
                    success: function (response) {
                        coreapp.notify('Update product successful', 'success');
                        $('#modalAddEdit').modal('hide');
                        resetFormMaintainance();

                        coreapp.stopLoading();
                        loadData(true);
                    },
                    error: function () {
                        coreapp.notify('Has an error in save product progress', 'error');
                        coreapp.stopLoading();
                    }
                });
                return false;
            }

        });
    }

    function initTreeDropDownCategory(selectedId) {
        $.ajax({
            url: "/Admin/ProductCategory/GetAll",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (response) {
                var data = [];
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                });
                var arr = coreapp.unflatten(data);
                $('#ddlCategoryIdM').combotree({
                    data: arr
                });
                if (selectedId != undefined) {
                    $('#ddlCategoryIdM').combotree('setValue', selectedId);
                }
            }
        });
    }
    function resetFormMaintainance() {
        $('#hidIdM').val(0);
        $('#txtNameM').val('');
        initTreeDropDownCategory('');

        $('#txtDescM').val('');
        $('#txtUnitM').val('');

        $('#txtPriceM').val('0');
        $('#txtOriginalPriceM').val('');
        $('#txtPromotionPriceM').val('');

        //$('#txtImageM').val('');

        $('#txtTagM').val('');
        $('#txtMetakeywordM').val('');
        $('#txtMetaDescriptionM').val('');
        $('#txtSeoPageTitleM').val('');
        $('#txtSeoAliasM').val('');

        //CKEDITOR.instances.txtContentM.setData('');
        $('#ckStatusM').prop('checked', true);
        $('#ckHotM').prop('checked', false);
        $('#ckShowHomeM').prop('checked', false);

    }

    function loadCategories() {
        $.ajax({
            type: 'GET',
            url: '/Admin/Product/GetAllCategories',
            
            dataType: 'json',
            success: function (response) {
                var render = "";
                render += "<option value=''>--Select Category--</option>";
                $.each(response, function (index, item) {
                    
                    render += "<option value='" + item.Id + "'>" + item.Name + "</option>";
                });
                $('#ddlCategory').html(render);
            },
            error: function (status) {
                console.log(status);
                coreapp.notify("Cannot load product categories", "error")
            }
        });
    }

    function loadData(isPageSizeChanged) {
        var template = $('#tbl_template').html();
        var render = "";
        $.ajax({
            type: 'GET',
            url: '/Admin/Product/GetAllPaging',
            data: {
                categoryId: $('#ddlCategory').val(),
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