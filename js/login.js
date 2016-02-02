$(document).ready(function() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    $("#submit").click(function() {
        $.ajax({
            type: "GET",
            url: me.host("login"),
            dataType: "json",
            data: {
                username: username,
                password: password
            },
            error: function(res) {
                console.log("ajax error");
            },
            success: function(res) {
                if(res.Success === true ){
                    // 设置cookie, 跳转页面
                    setCookie('Accesstoken', res.Accesstoken);
                    setCookie('Name', res.Data.Name);
                    setCookie('Bid', res.Data.Bid);
                    setCookie('Userid', res.Data.Userid);
                    window.location.href = "management.html";
                }else{
                    alert("用户名或者密码错误！");
                }
            }
        });
    });
});
