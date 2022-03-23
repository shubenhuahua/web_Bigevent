(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserInfo()
        //定义获取用户的基本信息的函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) return layer.msg("获取用户信息失败！")
                layer.msg("获取用户信息成功！")
                form.val("formUserInfo", res.data)
            }
        })
    }
    //监听重置按钮的点击事件
    $("#btnReset").on("click", function(e) {
        e.preventDefault()
        initUserInfo()
    })

    //发起请求更新用户的信息
    $("#user_form").submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg("修改用户信息失败！")
                layer.msg("更新用户信息成功！")
                window.parent.getUserInfo()
            }
        })
    })
})()