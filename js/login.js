

$(document).ready(function() {
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    $("#submit").click(function() {
        url:'accounts/login.aspx',// 跳转到 action
            data:{
                userName: userName，
                password: password
            },
            type:'get',
            dataType:'json',
            success:function(data) {
                if(data.Success == "true" ){
                    // 设置cookie, 跳转页面
                    setCookie('Accesstoken', data.Accesstoken);
                    setCookie('Name', data.Data.Name);
                    window.location.href = "management.html"; 
                }else{
                    alert("用户名或者密码错误！");
                }
             },
             error : function() {
                alert("用户名或者密码错误！");
             }
    });
});
