$(function() {
    // 加载页面公共部分
    me.util.layout();
    var bid = getCookie('Bid');
    var bname = getCookie('Bname');
    var semiPoint = 3;
    $('#checkbox-title').append(bname);
    var spin = $('#map3d');

    $("#twoDBtn").on("click", function() {
        $("#map2d").css('display', 'block');
        $("#map3d").css('display', 'none');
        $("#next").css('display', 'none');
    });
    $("#threeDBtn").on("click", function() {
        $("#map2d").css('display', 'none');
        $("#map3d").css('display', 'block');
        $("#next").css('display', 'block');
    });
    window.onresize = function() {
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
        $("#middle").css({
            width: windowWidth,
            height: windowHeight
        });
        $(".checkbox-area").css("height", windowHeight - 40);
        $(".right-area").css("height", windowHeight - 40);
        $(".safe-title").css("width", windowWidth - 325);
        $(".map-outer").css("width", windowWidth - 325);
        $(".map-outer").css("height", windowHeight - 88);
        // 如果屏幕长宽比较小
        if ((windowHeight - 88) / 0.75 > windowWidth - 305) {
            $("#map2d").css("width", windowWidth - 305);
            $("#map2d").css("height", (windowWidth - 305) * 0.75);
            $("#map3d").css("width", windowWidth - 305);
            $("#map3d").css("height", (windowWidth - 305) * 0.75);
        } else {
            $("#map2d").css("width", (windowHeight - 88) / 0.75);
            $("#map2d").css("height", windowHeight - 88);
            $("#map3d").css("width", (windowHeight - 88) / 0.75);
            $("#map3d").css("height", windowHeight - 88);
        }
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
        }
    }

    // 初始化全屏
    (function initScreen() {
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
        $("#middle").css({
            width: windowWidth,
            height: windowHeight
        });
        $(".checkbox-area").css("height", windowHeight - 40);
        $(".right-area").css("height", windowHeight - 40);
        $(".safe-title").css("width", windowWidth - 325);
        $(".map-outer").css("width", windowWidth - 325);
        $(".map-outer").css("height", windowHeight - 88);
        // 如果屏幕长宽比较小
        if ((windowHeight - 88) / 0.75 > windowWidth - 305) {
            $("#map2d").css("width", windowWidth - 305);
            $("#map2d").css("height", (windowWidth - 305) * 0.75);
            $("#map3d").css("width", windowWidth - 305);
            $("#map3d").css("height", (windowWidth - 305) * 0.75);
        } else {
            $("#map2d").css("width", (windowHeight - 88) / 0.75);
            $("#map2d").css("height", windowHeight - 88);
            $("#map3d").css("width", (windowHeight - 88) / 0.75);
            $("#map3d").css("height", windowHeight - 88);
        }

        $('#fullScreenModal').modal('show');
        $("#full-screen").on("click", function() {
            requestFullScreen();
        });
    })();

    // 中间图部分
    $.ajax({
        type: "GET",
        url: me.host("floorMapBasic"),
        dataType: "json",
        data: {
            bid: bid
        },
        error: function(res) {
            alert("floorName ajax error!");
        },
        success: function(res) {
            checkboxInit();
            $("#safe-title").html('安全风险系数: ' + res.Safety_ratio);
            $("#patrol-day-complete").html(res.Patrol_day_complete);
            $("#patrol-month-complete").html(res.Patrol_month_complete);
            $("#patrol-normal").html(res.Patrol_month_normal);

            for (var i in res.Floor) {
                if (i == 0) {
                    $("#floor-select").append('<option value="' + res.Floor[i].Floorid + '" id="' + res.Floor[i].Floorid + '" selected>' + res.Floor[i].Floorname + '</option>');
                } else {
                    $("#floor-select").append('<option value="' + res.Floor[i].Floorid + '" id="' + res.Floor[i].Floorid + '">' + res.Floor[i].Floorname + '</option>');
                }
            }
            init2DFloor($("#floor-select").val());
            init3DFloor($("#floor-select").val());
            $("#map3d").css('display', 'none');

            $("#floor-select").on("change", function() {
                init2DFloor($("#floor-select").val());
                init3DFloor($("#floor-select").val());
            });
            $("#closeBtn").on("click", function() {
                window.opener = null;
                window.open("", "_self");
                window.close();
            });
        }
    });

    // 3D图片旋转函数
    function threeDInit(urlArr, spin) {
        var frames = SpriteSpin.sourceArray(urlArr[0] + '3D/' + '{frame}' + '.' + urlArr[1], {
            frame: [1, 24],
            digits: 2
        });
        // 要停留的图片
        var details = [0, 12];
        var detailIndex = 0;
        // 初始化
        // spin.removeAttr("class");
        spin.spritespin({
            source: frames,
            width: parseFloat($("#map3d").css("width")),
            sense: -1,
            height: parseFloat($("#map3d").css("height")),
            animate: false
        });
        // 得到api
        var api = spin.spritespin("api");
        spin.bind("onLoad", function() {
            var data = api.data;
            data.stage.prepend($(".details .detail"));
            data.stage.find(".detail").hide();
        }).bind("onFrame", function() {
            var data = api.data;
            data.stage.find(".detail:visible").stop(false).fadeOut();
            data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
        });
        $("#next").click(function() {
            setDetailIndex(detailIndex + 1);
        });

        function setDetailIndex(index) {
            detailIndex = index;
            if (detailIndex < 0) {
                detailIndex = details.length - 1;
            }
            if (detailIndex >= details.length) {
                detailIndex = 0;
            }
            api.playTo(details[detailIndex]);
        }
        $("#details").append('<div class="detail detail-0"></div>');
        $("#details").append('<div class="detail detail-12"></div>');
    }

    // 初始化2D图片
    function init2DFloor(floor) {
        $.ajax({
            type: "GET",
            url: me.host("floorMapInit"),
            dataType: "json",
            data: {
                bid: bid,
                floor_id: floor[0],
                picType: '平面图'
            },
            error: function(res) {
                alert("floorMapInit ajax error!");
            },
            success: function(res) {
                var width = parseFloat($("#map2d").css("width"));
                var height = parseFloat($("#map2d").css("height"));
                $("#map2d").css("background-image", "url(" + res.Url + ")");
                $("#map2d").html('');
                res.Point.forEach(function(obj) {
                    if (obj.Point_type == "传感器") {
                        $("#map2d").append('' +
                            '<div class="state normal" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;" id="' + obj.Id + '2d' + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                        );
                    } else if (obj.Point_type == "巡检点") {
                        $("#map2d").append('' +
                            '<div class="state normal" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;" id="' + obj.Id + '2d' + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                        );
                    }
                    // 重写tips方法
                    var element = "#" + obj.Id + '2d';
                    floorMapTip(element, obj);
                });

                $(".checkbox-item").each(function() {
                    var point_type = $(this).attr("point_type");
                    $(".state").hide();
                    var all = document.getElementsByClassName("checkbox-item");
                    for (var i = 0; i < all.length; i++) {
                        if (all[i].checked === true) {
                            $(".state[equipment_type='" + all[i].value + "']").show();
                        }
                    }
                });
                monitor();
            }
        });
    }

    // 初始化3D图片
    function init3DFloor(floor) {
        spin.unbind('onLoad');
        spin.unbind('onFrame');
        $.ajax({
            type: "GET",
            url: me.host("floorMapInit"),
            dataType: "json",
            data: {
                bid: bid,
                floor_id: floor[0],
                picType: '3D图'
            },
            error: function(res) {
                alert("floorMapInit ajax error!");
            },
            success: function(res) {
                var re = /3D\/[0-9]+./g;
                var urlArr = res.Url.split(re);
                var width = parseFloat($("#map3d").css("width"));
                var height = parseFloat($("#map3d").css("height"));
                // 将素材赋给3D旋转图
                threeDInit(urlArr, spin);
                res.Point.forEach(function(obj) {
                    if (obj.Point_type == "传感器") {
                        if (obj.Photo_angle == "0") {
                            $(".detail-0").append('' +
                                '<div class="state normal ' + obj.Id + '3d' + '" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;z-index:999;"  point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                            );
                        } else if (obj.Photo_angle == "180") {
                            $(".detail-12").append('' +
                                '<div class="state normal ' + obj.Id + '3d' + '" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;z-index:999;"  point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                            );
                        }

                    } else if (obj.Point_type == "巡检点") {
                        if (obj.Photo_angle == "0") {
                            $(".detail-0").append('' +
                                '<div class="state normal ' + obj.Id + '3d' + '" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;z-index:999;" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                            );
                        } else if (obj.Photo_angle == "180") {
                            $(".detail-12").append('' +
                                '<div class="state normal ' + obj.Id + '3d' + '" style="top:' + (obj.Y * height - semiPoint) + 'px;left:' + (obj.X * width - semiPoint) + 'px;z-index:999;"  point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                            );
                        }
                    }
                    // 重写tips方法
                    var element = "." + obj.Id + '3d';
                    floorMapTip(element, obj);
                });

                $(".checkbox-item").each(function() {
                    var point_type = $(this).attr("point_type");
                    $(".state").hide();
                    var all = document.getElementsByClassName("checkbox-item");
                    for (var i = 0; i < all.length; i++) {
                        if (all[i].checked === true) {
                            $(".state[equipment_type='" + all[i].value + "']").show();
                        }
                    }
                });
                monitor();
            }
        });
    }

    function checkboxInit() {
        $.ajax({
            type: "GET",
            url: me.host("alarmdealstype"),
            dataType: "json",
            data: {},
            error: function(res) {
                alert("alarmdealstype ajax error!");
            },
            success: function(res) {
                $("#checkbox-equipment").html('<p class="p-title">挑选相关设备</p>');
                // 添加全选框
                $("#checkbox-equipment").append('<p><input class="checkbox-item" type="checkbox" point_type="equipment" id="checkAll"/><label for=checkAll>全选/反选</label></p>');
                res.forEach(function(obj) {
                    var check = obj.Ischoose == "1" ? "checked" : "";
                    $("#checkbox-equipment").append('<p><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj.Sensortype + '" id="' + obj.Sensortype + '" ' + check + '/><label for="' + obj.Sensortype + '">' + obj.Sensortype + '</label></p>');
                });
                $(".checkbox-item").on("change", function() {
                    var point_type = $(this).attr("point_type");
                    if (point_type == "equipment") {
                        $(".checkbox-item[point_type='inspect']").prop("checked", false);
                        if ($(this).attr('id') === 'checkAll') {
                            $(".checkbox-item[point_type='equipment']").prop("checked", $(this)[0].checked);
                        }
                    } else if (point_type == "inspect") {
                        $(".checkbox-item[point_type='equipment']").prop("checked", false);
                    }
                    $(".state").hide();
                    var all = document.getElementsByClassName("checkbox-item");
                    for (var i = 0; i < all.length; i++) {
                        if (all[i].checked === true) {
                            $(".state[equipment_type='" + all[i].value + "']").show();
                        }
                    }
                });
            }
        });
    }

    function monitor() {
        var uniqueAlarmFloorArr = [];
        setInterval(function() {
            var floorIdCurrent = $("#floor-select").val();
            $.ajax({
                type: "GET",
                url: me.host("floorMapMonitor"),
                dataType: "json",
                data: {
                    bid: bid,
                    floor_id: floorIdCurrent[0]
                },
                error: function(res) {
                    alert("floorMapMonitor ajax error!");
                },
                success: function(res) {
                    if (uniqueAlarmFloorArr.length > 0) {
                        for (var i = 0; i < uniqueAlarmFloorArr.length; i++) {
                            $('#' + uniqueAlarmFloorArr[i]).css('background-color', '');
                        }
                    }
                    var alarmFloorArr = [];
                    for (var i = 0; i < res.Point_state.length; i++) {
                        if (res.Point_state[i].State == 1 || res.Point_state[i].State == 2) {
                            alarmFloorArr.push(res.Point_state[i].Floorid);
                        }
                    }
                    uniqueAlarmFloorArr = unique(alarmFloorArr);
                    for (var i = 0; i < uniqueAlarmFloorArr.length; i++) {
                        $('#' + uniqueAlarmFloorArr[i]).css('background-color', 'red');
                    }
                    if (floorIdCurrent) {
                        if ($("#map3d").css("display") === 'block') {
                            res.Point_state.forEach(function(val) {
                                if (val.Floorid == floorIdCurrent[0]) {
                                    switch (val.State) {
                                        case "0":
                                            changeClass(val.Id + '3d', "normal");
                                            break;
                                        case "1":
                                            changeClass(val.Id + '3d', "alerting");
                                            break;
                                        case "2":
                                            changeClass(val.Id + '3d', "abnormal");
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        } else {
                            res.Point_state.forEach(function(val) {
                                if (val.Floorid == floorIdCurrent[0]) {
                                    switch (val.State) {
                                        case "0":
                                            changeClass(val.Id + '2d', "normal");
                                            break;
                                        case "1":
                                            changeClass(val.Id + '2d', "alerting");
                                            break;
                                        case "2":
                                            changeClass(val.Id + '2d', "abnormal");
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        }

                    }
                    var n = 1;
                    $(".untreated-alarm").html('');
                    for (var i in res.Untreated_alarm) {
                        $(".untreated-alarm").append('' +
                            '<p><a href="#" id=' + res.Untreated_alarm[i].Id + '>' + n++ + '. ' + res.Untreated_alarm[i].Type + '</a></p>'
                        );
                        //绑定事件
                        $('#' + res.Untreated_alarm[i].Id).on('click', function() {
                            var alarm_id = $(this).attr('id');
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
                                    $("#myModalLabel").html("告警处理：" + res.Text);
                                    $(".alarmDeal-pic").html("");
                                    $(".alarmDeal-pic").css({
                                        "background-image": "url('" + res.Url + "')",
                                        "background-size": "auto 100%",
                                        "background-position": "center",
                                        "background-repeat": "no-repeat"
                                    });
                                    $(".alarmDeal-pic").append('' +
                                        '<div class="state alerting" style="top:' + (res.Y * height - 3) + 'px;left:' + (res.X * width - 3) + 'px;"></div>'
                                    );
                                    buttonBind('submit01', '误报', alarm_id);
                                    buttonBind('submit02', '末端水压异常', alarm_id);
                                    buttonBind('submit03', '常闭门未关闭', alarm_id);
                                    buttonBind('submit04', '消防通道堵塞', alarm_id);
                                    buttonBind('submit05', '火警', alarm_id);
                                    buttonBind('submit06', '其他', alarm_id, true);

                                    $('#myModal').modal('show');
                                }
                            });
                        });
                    }
                }
            });
        }, 5000);
    }

    function changeClass(idName, className) {
        $("#" + idName).removeClass("normal");
        $("#" + idName).removeClass("abnormal");
        $("#" + idName).removeClass("alerting");
        $("#" + idName).addClass(className);
    }

    function buttonBind(bname, btitle, alarm_id, isSepcial) {
        $("#" + bname).on("click", function() {
            if (isSepcial) {
                buttonBind('submit07', '', alarm_id);
                $('#myModal').modal('hide');
                $('#reasonInputModal').modal('show');
                return;

            }
            if (bname === 'submit07') {
                if ($('#reasonInput').val()) {
                    btitle = $('#reasonInput').val();
                } else {
                    alert("请输入原因");
                    return;
                }
            }
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: btitle
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    }
                    $('#myModal').modal('hide');
                    $('#reasonInputModal').modal('hide');
                    // 刷新页面
                    location.reload();
                }
            });
        });
    }

    // 数组取独
    function unique(arr) {
        var result = [],
            hash = {};
        for (var i = 0, elem;
            (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

    // 给点添加Tip监听函数
    function floorMapTip(element, data) {
        console.log(element, data);
        $(element).bind("mouseover", function() {
            var abs = getAbsPosition($(element)[0]);
            //对于3d图中180度的情况
            if (!abs.x && !abs.y) {
                abs = getAbsPosition($(element)[1]);
            }
            x = abs.x + 20;
            y = abs.y;
            switch (data.State) {
                case '0':
                    console.log("123123");
                    data.State = '正常';
                    break;
                case '1':
                    data.State = '异常';
                    break;
                case '2':
                    data.State = '无效';
                    break;
            }
            $("body").append(
                '<div class="tip" style="top:' + y + 'px;left:' + x + 'px;">' +
                '<ul><li class="th">传感器Id</li><li class="tr" id="Sensorid">' + data.Sensorid + '</li></ul>' +
                '<ul><li class="th">网关标识</li><li class="tr" id="Gatewaylogo">' + data.Gatewaylogo + '</li></ul>' +
                '<ul><li class="th">传感器标识</li><li class="tr" id="Sensorlogo">' + data.Sensorlogo + '</li></ul>' +
                '<ul><li class="th">楼层</li><li class="tr" id="Floor">' + data.Floor + '</li></ul>' +
                '<ul><li class="th">位置</li><li class="tr" id="Name">' + data.Name + '</li></ul>' +
                '<ul><li class="th">传感器类型</li><li class="tr" id="Equipment_type">' + data.Equipment_type + '</li></ul>' +
                '<ul><li class="th">传感器型号</li><li class="tr" id="Sensormodel">' + data.Sensormodel + '</li></ul>' +
                '<ul><li class="th">当前状态</li><li class="tr" id="State">' + data.State + '</li></ul>' +
                '<ul><li class="th">告警值</li><li class="tr" id="Alarmvalue">' + data.Alarmvalue + '</li></ul>'+
                '</div>'
            )
        });
        $(element).on("mouseout", function() {
        	$(".tip").remove();
        });
    }

    //获取元素绝对位置
    function getAbsPosition(element) {
        var abs = {
            x: 0,
            y: 0
        }

        //如果浏览器兼容此方法
        if (document.documentElement.getBoundingClientRect) {
            //注意，getBoundingClientRect()是jQuery对象的方法
            //如果不用jQuery对象，可以使用else分支。
            abs.x = element.getBoundingClientRect().left;
            abs.y = element.getBoundingClientRect().top;

            abs.x += window.screenLeft +
                document.documentElement.scrollLeft -
                document.documentElement.clientLeft;
            abs.y += window.screenTop +
                document.documentElement.scrollTop -
                document.documentElement.clientTop;

        }

        //如果浏览器不兼容此方法
        else {
            while (element != document.body) {
                abs.x += element.offsetLeft;
                abs.y += element.offsetTop;
                element = element.offsetParent;
            }

            //计算想对位置
            abs.x += window.screenLeft +
                document.body.clientLeft - document.body.scrollLeft;
            abs.y += window.screenTop +
                document.body.clientTop - document.body.scrollTop;

        }

        return abs;
    }

});
