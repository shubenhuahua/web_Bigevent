$.ajaxPrefilter(function(option) {
    option.url = "http://www.liulongbin.top:3007" + option.url;
    //统一为有权限的接口设置headers请求头
    // 判断是否是需要权限的
    if (option.url.valueOf("/my/") !== -1) {
        option.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    option.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
            localStorage.removeItem("token")
            location.href = "/login.html"
        }
    }
})