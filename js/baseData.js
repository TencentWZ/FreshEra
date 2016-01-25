

$(document).ready(function() {
    // 从后台获得数据，拼接html显示在页面上
    var bid = "123";
    $.ajax({
        type: "GET",
        url: me.host("baseData"),
        dataType: "json",
        data: {
            bid: bid
        },
        error: function(res) {
            alert("服务器错误，请联系相关维护人员");
        },
        success: function(res) {
            if(res.Success === true ){
                // 页面处理方法
            }else{
                alert("用户名或者密码错误！");
            }
        }
    });

    var render = function(data) {
        
    };
});
