(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化文章类别方法
    initCate()

    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg("获取文章分类失败！")
                    // for (var i = 0; i < res.data.length; ++i) {
                    //     res.data[i]['select'] = '';
                    //     if (res.data[i].Id === 2) {
                    //         res.data[i]['select'] = 'selected';
                    //     }
                    // }
                    // console.log(res);
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $("#chooseImg").on("click", function() {
        $("#coverFile").click()
    })
    $("#coverFile").on("change", function(e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
            // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = "已发布"
    $("#btnSave2").on("click", function() {
            art_state = "草稿"
        })
        // 监听表单的提交事件
    $("#form-pub").submit(function(e) {
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        console.log(fd);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append("state", art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append("cover_img", blob)
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layer.msg("发布文章失败!")
                layer.msg("发布文章成功!")
                location.href = "/article/art_list.html"
            }
        })
    }
    // 获得查询字符串的id值
    var urlSearchParams = new URLSearchParams(window.location.search);
    // console.log(window.location.search);
    var id = urlSearchParams.get('id');

    getArticle(id)

    //根据id获取对应的文章信息
    function getArticle(id) {
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                // console.log(res);
                data = res.data;
                // console.log(data.title);
                // initCate_Id(data.cate_id)
                console.log($("[name=cate_id]").children("[value=" + data.cate_id + "]"));
                $("[name=cate_id]").children("[value=" + data.cate_id + "]").attr("selected", "q")
                console.log($("[name=cate_id]").children("[value=" + data.cate_id + "]"));

                $("[name=title]").val(data.title);
                $("[name=content]").val(data.content)
                $("#image").attr("src", data.cover_img)
            }
        })
    }
    //根据id获取文章分类数据
    function initCate_Id(cate_id) {
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + cate_id,
            success: function(res) {
                // console.log(res.data.name);
                var cate = res.data.name
                $("[name=cate_id]").val(cate)
            }
        })
    }
})()