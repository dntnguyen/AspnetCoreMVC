var productCategoryController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();
    }

    function registerEvents() {

        
    }

    function loadData() {
        $.ajax({
            type: 'GET',
            url: '/Admin/ProductCategory/GetAll',
            dataType: 'json',
            success: function (response) {
                var data = [];
                $.each(response, function (index, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                    
                });

                var treeArr = coreapp.unflatten(data);
                treeArr.sort(function (a, b) {
                    return a.sortOrder - b.sortOrder;
                });
                ////var $tree = $('#treeProductCategory');

                $('#treeProductCategory').tree({
                    data: treeArr,
                    dnd: true,
                    onDrop: function (target, source, point) {
                        var targetNode = $(this).tree('getNode', target);
                        if (point === 'append') {
                            var children = [];
                            $.each(targetNode.children, function (index, item) {
                                children.push({
                                    key: item.id,
                                    value: index
                                });
                            })
                            //Update to database
                            $.ajax({
                                url: '/Admin/ProductCategory/UpdateParentId',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id,
                                    items: children
                                },
                                success: function (response) {
                                    loadData;
                                }
                            });
                        } else if (point === 'top' || point === 'bottom') {
                            $.ajax({
                                url: '/Admin/ProductCategory/ReOrder',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id
                                },
                                success: function (response) {
                                    loadData;
                                }
                            });
                        }
                    }
                })
            },
            error: function (status) {
                console.log(status);
                coreapp.notify("Cannot load product category", "error")
            }
        });
    }
   

}