$(function() {
	// 加载页面公共部分
	me.util.layout();
    var bid = getCookie('Bid');
    var alarm_id = getQueryString("alarm_id");

    function getQueryString(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        };
        return result[1];
    };

    window.onresize = function() {  
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        $("#middle").css({width: windowWidth, height: windowHeight});
        $(".checkbox-area").css("height", windowHeight - 40);
        $(".right-area").css("height", windowHeight - 40);
        $(".safe-title").css("width", windowWidth - 305);
        $(".map-outer").css("width", windowWidth - 305);
    };

    // 全屏显示
    function requestFullScreen() {
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        };
    };

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
        $("#full-screen-prompt").click();
        $("#full-screen").on("click", function() {
            requestFullScreen();
        });
    })();
    
	$.ajax({
        type: "GET",
        url: me.host("alarmDealInit"),
        dataType: "json",
        data: {
            bid: bid,
            alarm_id: alarm_id
        },
        error: function(res) {
            alert("alarmDeal ajax error!");
        },
        success: function(res) {
            var width = parseFloat($(".alarmDeal-pic").css("width"));
            var height = parseFloat($(".alarmDeal-pic").css("height"));
            $(".alarmDeal-message").html(res.Text);
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
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "误报"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit02").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "末端水压异常"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit03").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "常闭门未关闭"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit04").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "消防通道堵塞"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit05").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "暂缓处理"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit06").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: $("#other-reason").val()
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

        $("#submit07").bind("click", function() {
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: "火警"
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    };
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            });
        });

    })();

});
