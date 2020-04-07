var ProductController = function () {
    var self = this;

    var quantityManagement = new QuantityManagement();
    var imageManagement = new ImageManagement();
    var wholePriceManagement = new WholePriceManagement();

    this.initialize = function () {
        loadCategories();
        loadData(false);
        registerEvents();
        registerControls();
        quantityManagement.initialize();
        imageManagement.initialize();
        wholePriceManagement.initialize();
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

        $('#frmImportExcel').validate({
            errorClass: 'red',
            ignore: [],
            //lang: 'en',
            rules: {
                ddlCategoryIdImportExcel: { required: true },
              
            }
        });

        $('#ddl-show-page').on('change', function () {
            console.log("change");
            coreapp.configs.pageSize = $(this).val();
            coreapp.configs.pageNo = 1;

            loadData(true);
        })

        $('#btn-search').on('click', function () {
            loadData(false);
        })

        $('#txtKeyword').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                loadData(false);
            }
        });

        $('#btnSelectImg').on('click', function () {
            $('#fileInputImage').click();
        });
        $("#fileInputImage").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadImage",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    $('#txtImage').val(path);
                    coreapp.notify('Upload image succesful!', 'success');

                },
                error: function () {
                    coreapp.notify('There was error uploading files!', 'error');
                }
            });
        });

        $("#btn-create").on('click', function () {
            initTreeDropDownCategory();
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');
        });
        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            editProduct(that);
        });

        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            deleteProduct(that);
        });

        $('#btnSave').on('click', function (e) {
            saveProduct();
        });

        $('#btn-import').on('click', function () {
        
            initTreeDropDownCategory();
            $('#modal-import-excel').modal('show');
        });

        $('#btnImportExcel').on('click', function () {
            importExcel();
            return false;
        });

        $('#btn-export').on('click', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/Product/ExportExcel",
                beforeSend: function () {
                    coreapp.startLoading();
                },
                success: function (response) {
                    window.location.href = response;
                    coreapp.stopLoading();
                },
                error: function () {
                    coreapp.notify('Has an error in progress', 'error');
                    coreapp.stopLoading();
                }
            });
        });
    }

    function importExcel() {
        if ($('#frmImportExcel').valid()) {
            var fileUpload = $("#fileInputExcel").get(0);
            var files = fileUpload.files;

            // Create FormData object  
            var fileData = new FormData();
            // Looping over all files and add it to FormData object  
            for (var i = 0; i < files.length; i++) {
                fileData.append("files", files[i]);
            }
            // Adding one more key to FormData object  
            fileData.append('categoryId', $('#ddlCategoryIdImportExcel').combotree('getValue'));
            $.ajax({
                url: '/Admin/Product/ImportExcel',
                type: 'POST',
                data: fileData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success: function (data) {
                    $('#modal-import-excel').modal('hide');
                    loadData();

                }
            });
        }
    }

    function editProduct(id) {
        $.ajax({
            type: "GET",
            url: "/Admin/Product/GetById",
            data: { id: id },
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

                $('#txtImage').val(data.ThumbnailImage);

                $('#txtTagM').val(data.Tags);
                $('#txtMetakeywordM').val(data.SeoKeywords);
                $('#txtMetaDescriptionM').val(data.SeoDescription);
                $('#txtSeoPageTitleM').val(data.SeoPageTitle);
                $('#txtSeoAliasM').val(data.SeoAlias);

                CKEDITOR.instances.txtContent.setData(data.Content);
                $('#ckStatusM').prop('checked', data.Status == 1);
                $('#ckHotM').prop('checked', data.HotFlag);
                $('#ckShowHomeM').prop('checked', data.HomeFlag);

                $('#modal-add-edit').modal('show');
                coreapp.stopLoading();

            },
            error: function (status) {
                coreapp.notify('Có lỗi xảy ra', 'error');
                coreapp.stopLoading();
            }
        });
    }

    function deleteProduct(id) {
        coreapp.confirm('Are you sure to delete?', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/Product/Delete",
                data: { id: id },
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
    }

    function saveProduct() {
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

            var image = $('#txtImage').val();

            var tags = $('#txtTagM').val();
            var seoKeyword = $('#txtMetakeywordM').val();
            var seoMetaDescription = $('#txtMetaDescriptionM').val();
            var seoPageTitle = $('#txtSeoPageTitleM').val();
            var seoAlias = $('#txtSeoAliasM').val();

            var content = CKEDITOR.instances.txtContent.getData();
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
                    Image: image,
                    Price: price,
                    OriginalPrice: originalPrice,
                    PromotionPrice: promotionPrice,
                    Description: description,
                    Content: content,
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
                    $('#modal-add-edit').modal('hide');
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
    }

    function registerControls() {
        CKEDITOR.replace('txtContent', {});
       
        //Fix: cannot click on element ck in modal
        $.fn.modal.Constructor.prototype._enforceFocus = function () {
            
            $(document)
                .off('focusin.bs.modal') // guard against infinite focus loop
                .on('focusin.bs.modal', $.proxy(function (e) {
                    try {
                        if (
                            this.$element[0] !== e.target && !this.$element.has(e.target).length
                            // CKEditor compatibility fix start.
                            && !$(e.target).closest('.cke_dialog, .cke').length
                            // CKEditor compatibility fix end.
                        ) {
                            this.$element.trigger('focus');
                        }
                    } catch (error) {

                    }
                }, this));
        };

      

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

                $('#ddlCategoryIdImportExcel').combotree({
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

        $('#txtImage').val('');

        $('#txtTagM').val('');
        $('#txtMetakeywordM').val('');
        $('#txtMetaDescriptionM').val('');
        $('#txtSeoPageTitleM').val('');
        $('#txtSeoAliasM').val('');

        CKEDITOR.instances.txtContent.setData('');
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
        var template = $('#tbl-template').html();
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
                    $('#tbl-content').html(render);
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