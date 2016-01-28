$(function() {
	// 加载页面公共部分
	me.util.layout();

    // 中间图部分
    $.ajax({
        type: "GET",
        url: me.host("floorMapBasic"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("floorName ajax error!");
        },
        success: function(res) {
            checkboxInit(res.equipment_type);
            $(".title").html('安全风险系数: ' + res.safety_ratio);console.log(res);
            $("#patrol-day-complete").html(res.patrol_day_complete);
            $("#patrol-day-normal").html(res.patrol_day_normal);
            $("#patrol-month-complete").html(res.patrol_month_complete);
            $("#patrol-month-normal").html(res.patrol_month_normal);
            for (var i in res.floor) {
                $("#floor-select").append('<option value="' + i + '">' + res.floor[i] + '</option>');
            };
            initFloor($("#floor-select").val());
            $("#floor-select").on("change", function() {
                initFloor($("#floor-select").val());
            });
        }
    });
    
    function initFloor(floor) {
        $.ajax({
            type: "GET",
            url: me.host("floorMapInit"),
            dataType: "json",
            data: {floor: floor},
            error: function(res) {
                alert("floorMapInit ajax error!");
            },
            success: function(res) {
                var width = parseFloat($(".map").css("width"));
                var height = parseFloat($(".map").css("height"));
                $(".map").css("background", "url(" + res.url + ") no-repeat");
                $(".map").html('');
                res.point.forEach(function(obj) {
                    if (obj.point_type == "equipment") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="equipment" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                    } else if (obj.point_type == "inspect") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="inspect" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                    };
                });
                monitor();
            }
        });
    };

    function checkboxInit(checkboxArr) {
        $("#checkbox-equipment").html('');
        checkboxArr.forEach(function(obj) {
            $("#checkbox-equipment").append('<label><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj + '" />' + obj + '</label>');
        });
        $(".checkbox-item").on("change", function() {
            var point_type = $(this).attr("point_type");
            if (point_type == "equipment") {
                $(".checkbox-item[point_type='inspect']").prop("checked", false);
            } else if (point_type == "inspect") {
                $(".checkbox-item[point_type='equipment']").prop("checked", false);
            };
            $(".state").hide();
            var all = document.getElementsByClassName("checkbox-item");
            for (var i = 0; i < all.length; i++) {
                if (all[i].checked == true) {
                    $(".state[equipment_type='" + all[i].value + "']").show();
                };
            };
        });
    };

    function monitor() {
        setInterval(function() {
            $.ajax({
                type: "GET",
                url: me.host("floorMapMonitor"),
                dataType: "json",
                data: {},
                error: function(res) {
                    alert("floorMapMonitor ajax error!");
                },
                success: function(res) {
                    var floorIdCurrent = $("#floor-select").val();
                    res.point_state.forEach(function(val) {
                        if (val.floor_id == floorIdCurrent) {
                            switch (val.state) {
                                case 0:
                                    changeClass(val.id, "normal");
                                    break;
                                case 1:
                                    changeClass(val.id, "abnormal");
                                    break;
                                case 2:
                                    changeClass(val.id, "alerting");
                                    $("#" + val.id).tips($("#" + val.id).attr("name") + "发生异常！");
                                    break;
                                default:
                            };
                        };
                    });
                    var n = 1;
                    $(".untreated-alarm").html('');
                    for (var i in res.untreated_alarm) {
                        $(".untreated-alarm").append('' +
                           '<p><a href="alarmDeal.html?id=' + i + '" target="_blank">' + n++ + '. ' + res.untreated_alarm[i] + '</a></p>'
                        );
                    };
                }
            });
        }, 1000);
    };

    function changeClass(idName, className) {
        $("#" + idName).removeClass("normal");
        $("#" + idName).removeClass("abnormal");
        $("#" + idName).removeClass("alerting");
        $("#" + idName).addClass(className);
    };

});
