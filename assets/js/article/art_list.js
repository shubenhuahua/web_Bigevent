(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义一个查询的参数对象，将来请求数据的时候，需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "" // 文章的发布状态
    }

    // 监听表单的提交事件
    $("#form-search").submit(function(e) {
            e.preventDefault()
            q.cate_id = $("[name=cate_id]").val()
            q.state = $("[name=state]").val()
            initTable()
        })
        // 定义美化时间格式的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + "-" + m + "-" + d + "-" + " " + hh + ":" + mm + ":" + ss
    }

    // 定义添零方法
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    // 初始化文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layer.msg("获取分类数据失败！")
                    // console.log(res);
                    // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }

    //定义一个动态获取文章列表的函数 并调用
    initTable()

    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) layer.msg("获取文章列表失败！")
                    // layer.msg("获取文章列表成功！")
                    // console.log(res);
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)

                //文章列表渲染完毕之后调用分页渲染函数，渲染分页行
                renderPage(res.total)
            }
        })
    }
    //文章列表中编辑、删除操作
    $("tbody").on("click", "#btnDel", function() {
        var id = $(this).attr("data-id")
        var len = $(".btn-delete").length
        console.log(len);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg("删除文章失败！")
                    layer.msg("删除文章成功！")
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })

    //点击编辑
    $("tbody").on("click", "#btn-edit", function() {
            var id = $(this).attr("data-id")
            location.href = "/article/art_editPub.html?id=" + id;
        })
        // 分页
        // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
            count: total, //数据总数，从服务端得到
            layout: ["count", "limit", 'prev', 'page', 'next', "skip"],
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            limit: q.pagesize,
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

})()