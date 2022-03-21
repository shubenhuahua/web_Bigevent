(function() {
    getUserInfo();
    $("#layOut").on("click", function() {
        var layer = layui.layer;
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1、清空本地存储中的token
            localStorage.removeItem("token")
                // 2、重新跳转到登录页面
            index.url = "/login.html"
            layer.close(index);
        });
    })
})()
//获取用户基本信息函数
function getUserInfo() {
    var layer = layui.layer;
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            if (res.status !== 0) return layer.msg("获取用户信息失败");
            //调用渲染函数
            renderAvatar(res.data)
        },
        // 控制用户的访问权限,无论成功还是失败最终都会调用complete回调函数
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
        //         localStorage.removeItem("token")
        //         location.href = "/login.html"
        //     }
        // }
    })
}

function renderAvatar(option) {
    var name = option.nickname || option.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    if (option.user_pic !== null) {
        $(".layui-nav-img").attr("src", option.user_pic).show()
        $(".text-avatar").hide()
    } else {
        var first = name[0];
        $(".text-avatar").html(first).show();
        $(".layui-nav-img").hide();
    }

}