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
            checkboxInit(res.Ty);
            $(".safe-title").html('安全风险系数: ' + res.Safety_ratio);
            $("#patrol-day-complete").html(res.Patrol_day_complete);
            $("#patrol-day-normal").html(res.Patrol_day_normal);
            $("#patrol-month-complete").html(res.Patrol_month_complete);
            $("#patrol-month-normal").html(res.Patrol_month_normal);
            for (var i in res.Floor) {
                $("#floor-select").append('<option value="' + res.Floor[i].Floorid + '">' + res.Floor[i].Floorname + '</option>');
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
            data: {},
            error: function(res) {
                alert("floorMapInit ajax error!");
            },
            success: function(res) {
                var width = parseFloat($(".map").css("width"));
                var height = parseFloat($(".map").css("height"));
                $(".map").css("background-image", "url(" + res.Url + ")");
                $(".map").html('');
                res.Point.forEach(function(obj) {
                    if (obj.Point_type == "equipment") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.Y * height - 5) + 'px;left:' + (obj.X * width - 5) + 'px;" id="' + obj.Id + '" point_type="equipment" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                        );
                    } else if (obj.Point_type == "inspect") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.Y * height - 5) + 'px;left:' + (obj.X * width - 5) + 'px;" id="' + obj.Id + '" point_type="inspect" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
                        );
                    };
                });
                monitor();
            }
        });
    };

    function checkboxInit(checkboxArr) {
        $("#checkbox-equipment").html('<p class="p-title">挑选相关设备</p>');
        checkboxArr.forEach(function(obj) {
            $("#checkbox-equipment").append('<p><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj.Name + '" id="' + obj.Name + '" /><label for="' + obj.Name + '">' + obj.Name + '</label></p>');
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
                    res.Point_state.forEach(function(val) {
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
                    for (var i in res.Untreated_alarm) {
                        $(".untreated-alarm").append('' +
                           '<p><a href="alarmDeal.html?id=' + i + '" target="_blank">' + n++ + '. ' + res.Untreated_alarm[i] + '</a></p>'
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
