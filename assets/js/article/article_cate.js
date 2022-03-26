(function() {
    var layer = layui.layer
    var form = layui.form;
    //获取文章列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
        });
    })

    //新增文章分类
    $("body").on("submit", "#form-add", function(e) {
            e.preventDefault();
            // console.log("ok");
            $.ajax({
                method: "POST",
                url: "/my/article/addcates",
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败！')
                    };
                    layer.msg('新增分类成功！')
                    initArtCateList();
                    //关闭弹出层
                    layer.close(indexAdd);
                }
            })
        })
        //编辑文章分类
    var indexEdit = null;
    $("tbody").on("click", "#edit-btn", function() {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
        })
        var id = $(this).attr("data-id")
            // console.log(id);
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val("form-edit", res.data)
            }
        })

    })
    $("body").on("submit", "#form-edit", function(e) {
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) return layer.msg("更新分类信息失败");
                    layer.msg("更新分类信息成功");
                    initArtCateList();
                    layer.close(indexEdit);
                }
            })
        })
        //删除文章分类
    $("tbody").on("click", "#del-btn", function() {
        var id = $(this).attr("data-id")
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg("删除文章分类失败");
                    layer.msg("删除文章分类成功");
                    initArtCateList();
                    layer.close(index);
                }
            })

        });
    })
})()