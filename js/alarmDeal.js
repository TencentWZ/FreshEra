$(function() {
	// 加载页面公共部分
	me.util.layout();

	$.ajax({
        type: "GET",
        url: me.host("alarmDeal"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("alarmDeal ajax error!");
        },
        success: function(res) {
            $(".alarmDeal-message").text(res.text);
            $(".alarmDeal-pic").css({"background":"url('" + res.url + "')","background-size":"cover"});
        }
    });
});
