$(function() {
	// 加载页面公共部分
	me.util.layout();

	$.ajax({
        type: "GET",
        url: me.host("alarmDealInit"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("alarmDeal ajax error!");
        },
        success: function(res) {
            var width = parseFloat($(".alarmDeal-pic").css("width"));
            var height = parseFloat($(".alarmDeal-pic").css("height"));
            $(".alarmDeal-message").text(res.text);
            $(".alarmDeal-pic").css({"background":"url('" + res.url + "')", "background-size":"cover"});
            $(".alarmDeal-pic").append('' +
                '<div class="state alerting" style="top:' + (res.y * height - 5) + 'px;left:' + (res.x * width - 5) + 'px;"></div>'
            );
        }
    });
});
