

$(document).ready(function() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    $("#submit").click(function() {
        $.ajax({
            type: "GET",
            url: me.host("login"),
            dataType: "json",
            data: {
                // username: 'admin',
                // password: '1234'
            },
            error: function(res) {
                console.log("ajax error");
            },
            success: function(res) {
                if(res.Success === true ){
                    // 设置cookie, 跳转页面
                    setCookie('Accesstoken', res.Accesstoken);
                    setCookie('Name', res.Data.Name);
                    window.location.href = "management.html";
                }else{
                    alert("用户名或者密码错误！");
                }
            }
        });
    });
});
