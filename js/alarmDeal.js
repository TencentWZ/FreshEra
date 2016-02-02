$(function() {
	// 加载页面公共部分
	me.util.layout();

    // 初始化全屏
    (function initScreen() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        $("#middle").css({width: windowWidth, height: windowHeight});
        $(".alarm-outer").css("width", windowHeight - 150);
        $(".alarmDeal-message").css("width", windowHeight - 150);
        $(".alarmDeal-pic").css("width", windowHeight - 150);
        $(".alarmDeal-pic").css("height", windowHeight - 150);
        $(".alarmDeal-buttonGroup").css("width", windowHeight - 150);
    })();
    
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
            $(".alarmDeal-message").text(res.Text);
            $(".alarmDeal-pic").css({"background":"url('" + res.Url + "')", "background-size":"cover"});
            $(".alarmDeal-pic").append('' +
                '<div class="state alerting" style="top:' + (res.Y * height - 5) + 'px;left:' + (res.X * width - 5) + 'px;"></div>'
            );
        }
    });

    // 告警处理
    (function alarmDeal() {

        $("#submit01").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

        $("#submit02").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

        $("#submit03").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

        $("#submit04").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

        $("#submit05").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

        $("#submit06").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                }
            });
        });

    })();

});
