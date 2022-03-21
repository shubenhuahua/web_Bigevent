(function() {
    $(".link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $(".link_login").on("click", function() {
            $(".login-box").show()
            $(".reg-box").hide()
        })
        //预检验数据是否符合规定
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            if ($(".reg-box [name=password]").val() != value) {
                return "两次输入密码不一致";
            }
        }
    })

    var layer = layui.layer;
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        };
        $.ajax({
            url: "/api/reguser",
            method: "POST",
            data: data,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg("注册成功，请登录");
                $(".link_login").click();
            }
        })

    })
    $("#form_login").submit(function(e) {
        e.preventDefault();
        var data = {
            username: $("#form_login [name=username]").val(),
            password: $("#form_login [name=password]").val()
        };
        $.post("/api/login", data, function(res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg(res.message);
            //将返回来的token存到localStorage中
            localStorage.setItem("token", res.token);
            //跳转网页
            location.href = "/index.html";
        })


    })

})()