$(function() {
	// 加载页面公共部分
	// me.util.layout();
    
    // 中间图部分
    $.ajax({
        type: "GET",
        url: me.host("floorName"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("floorName ajax error!");
        },
        success: function(res) {
            for (var i in res) {
                $("#floor-select").append('<option value="' + i + '">' + res[i] + '</option>');
            };
            initFloor($("#floor-select").val());
            $("#floor-select").on("change", function() {
                initFloor($("#floor-select").val());
            });
        }
    });
    
    // 当前未处理告警
    setInterval(function() {
        $.ajax({
            type: "GET",
            url: me.host("untreatedAlarm"),
            dataType: "json",
            data: {},
            error: function(res) {
                alert("untreatedAlarm ajax error!");
            },
            success: function(res) {
                var n = 1;
                $(".untreated-alarm").html('');
                res.data.forEach(function(val) {
                    if (val.state == 0) {
                        $(".untreated-alarm").append('' +
                           '<p>' + n++ + ". " + val.text + '</p>'
                        );
                    };
                });
            }
        });
    }, 1000);
    
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
                var checkboxArr = [];
                var width = parseFloat($(".map").css("width"));
                var height = parseFloat($(".map").css("height"));
                $(".map").css("background", "url(" + res.url + ") no-repeat");
                $(".map").html('');
                $(".map").html('安全风险系数: ' + res.safety_ratio);
                res.point.forEach(function(obj) {
                    if (obj.point_type == "equipment") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="equipment" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                        var flag = true;
                        checkboxArr.forEach(function(checkboxItem) {
                            if (checkboxItem == obj.equipment_type) {
                                flag = false;
                            };
                        });
                        if (flag) {
                            checkboxArr.push(obj.equipment_type);
                        };
                    } else if (obj.point_type == "inspect") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="inspect" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                    };
                });
                checkboxInit(checkboxArr);
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
                    res.data.forEach(function(val) {
                        switch (val.state) {
                            case 0:
                                $("#" + val.id).removeClass("normal");
                                $("#" + val.id).removeClass("abnormal");
                                $("#" + val.id).removeClass("alert");
                                $("#" + val.id).addClass("normal");
                                break;
                            case 1:
                                $("#" + val.id).removeClass("normal");
                                $("#" + val.id).removeClass("abnormal");
                                $("#" + val.id).removeClass("alert");
                                $("#" + val.id).addClass("abnormal");
                                break;
                            case 2:
                                $("#" + val.id).removeClass("normal");
                                $("#" + val.id).removeClass("abnormal");
                                $("#" + val.id).removeClass("alert");
                                $("#" + val.id).addClass("alert");
                                break;
                            default:
                        };
                    });
                }
            });
        }, 1000);
    };

});
