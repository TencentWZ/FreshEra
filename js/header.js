$(document).ready(function() {
    var name = getCookie('Name');
    var Accesstoken = getCookie('Accesstoken');
    // 每个页面进行一次登录判断
    if ( !name || !Accesstoken) {
        alert("没有登录或登录超时，3s后跳转到首页，请重新登录");
    } else {
        $("#name").click(function() {
            alert("确定要注销吗？");
        });
        var nameDom = $('#name');
        nameDom.innerHTML = name;
    }
});
