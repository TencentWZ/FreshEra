$(function() {
	// 加载页面公共部分
	me.util.layout();
    var bid = getCookie('Bid');
    var spin = $( '#spritespin' );

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
        $(".checkbox-area").css("height", windowHeight - 40);
        $(".right-area").css("height", windowHeight - 40);
        $(".safe-title").css("width", windowWidth - 305);
        $(".map-outer").css("width", windowWidth - 305);
        $("#full-screen-prompt").click();
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
            $(".safe-title").html('安全风险系数: ' + res.Safety_ratio + '<button id="close" style="float:right;margin-right:20px;height:33px;line-height:30px;color:#424e54;font-size:15px;">关闭</button>');
            $("#patrol-day-complete").html(res.Patrol_day_complete);
            $("#patrol-month-complete").html(res.Patrol_month_complete);
            $("#patrol-normal").html(res.Patrol_month_normal);
            for (var i in res.Floor) {
                if (i == 0) {
                    $("#floor-select").append('<option value="' + res.Floor[i].Floorid + '" selected>' + res.Floor[i].Floorname + '</option>');
                } else {
                    $("#floor-select").append('<option value="' + res.Floor[i].Floorid + '">' + res.Floor[i].Floorname + '</option>');
                };
            };
            initFloor($("#floor-select").val());
            $("#floor-select").on("change", function() {
                initFloor($("#floor-select").val());
            });
            $("#close").on("click", function() {
                window.opener = null;
                window.open("", "_self");
                window.close();
            });
        }
    });

    function threeDInit ( urlArr, spin ) {
    	var frames = SpriteSpin.sourceArray( urlArr[ 0 ] + '3D/' + '{frame}' + '.' + urlArr[ 1 ], {
    		frame: [ 1, 24 ],
    		digits: 2
    	} );
    	// 要停留的图片
    	var details = [ 0, 12 ];
    	var detailIndex = 0;
    	// 初始化
    	// spin.removeAttr("class");
    	spin.spritespin( {
    		source: frames,
    		width: 733,
    		sense: -1,
    		height: 550,
    		animate: false
    	} );
    	// 得到api
    	var api = spin.spritespin( "api" );
    	spin.bind( "onLoad", function () {
    		var data = api.data;
    		data.stage.prepend( $( ".details .detail" ) );
    		data.stage.find( ".detail" ).hide();
    	} ).bind( "onFrame", function () {
    		var data = api.data;
    		data.stage.find( ".detail:visible" ).stop( false ).fadeOut();
    		data.stage.find( ".detail.detail-" + data.frame ).stop( false ).fadeIn();
    	} );
    	$( "#next" ).click( function () {
    		setDetailIndex( detailIndex + 1 );
    	} );

    	function setDetailIndex( index ) {
    		detailIndex = index;
    		if ( detailIndex < 0 ) {
    			detailIndex = details.length - 1;
    		}
    		if ( detailIndex >= details.length ) {
    			detailIndex = 0;
    		}
    		api.playTo( details[ detailIndex ] );
    	}
    	$( "#details" ).append( '<div class="detail detail-0"></div>' );
    	$( "#details" ).append( '<div class="detail detail-12"></div>' );
    };

    function initFloor(floor) {
        spin.unbind( 'onLoad' );
        spin.unbind( 'onFrame' );
        console.log(bid, floor[0]);
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
                console.log(res);
                var re = /3D\/[0-9]+./g;
                var urlArr = res.Url.split( re );
                var width = parseFloat($(".map").css("width"));
                var height = parseFloat($(".map").css("height"));
                // 将素材赋给3D旋转图
    			threeDInit( urlArr, spin );
    			res.Point.forEach( function ( obj ) {
    				if ( obj.Point_type == "传感器" ) {
    					if ( obj.Photo_angle == "0" ) {
    						$( ".detail-0" ).append( '' +
    							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
    						);
    					} else if ( obj.Photo_angle == "180" ) {
    						$( ".detail-12" ).append( '' +
    							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
    						);
    					}

    				} else if ( obj.Point_type == "巡检点" ) {
    					if ( obj.Photo_angle == "0" ) {
    						$( ".detail-0" ).append( '' +
    							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
    						);
    					} else if ( obj.Photo_angle == "180" ) {
    						$( ".detail-12" ).append( '' +
    							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
    						);
    					}
    				};
    			} );

                $(".checkbox-item").each(function() {
                    var point_type = $(this).attr("point_type");
                    $(".state").hide();
                    var all = document.getElementsByClassName("checkbox-item");
                    for (var i = 0; i < all.length; i++) {
                        if (all[i].checked == true) {
                            $(".state[equipment_type='" + all[i].value + "']").show();
                        };
                    };
                });
                monitor();
            }
        });
    };

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
                res.forEach(function(obj) {
                    var check = obj.Ischoose == "1" ? "checked" : "";
                    $("#checkbox-equipment").append('<p><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj.Sensortype + '" id="' + obj.Sensortype + '" ' + check + '/><label for="' + obj.Sensortype + '">' + obj.Sensortype + '</label></p>');
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
            }
        });
    };

    function monitor() {
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
                    if (floorIdCurrent) {
                        res.Point_state.forEach(function(val) {
                            if (val.Floorid == floorIdCurrent[0]) {
                                switch (val.State) {
                                    case "0":
                                        changeClass(val.Id, "normal");
                                        break;
                                    case "1":
                                        changeClass(val.Id, "abnormal");
                                        break;
                                    case "2":
                                        changeClass(val.Id, "alerting");
                                        $("#" + val.Id).tips($("#" + val.Id).attr("name") + "发生异常！");
                                        break;
                                    default:
                                };
                            };
                        });
                    };
                    var n = 1;
                    $(".untreated-alarm").html('');
                    for (var i in res.Untreated_alarm) {
                        $(".untreated-alarm").append('' +
                           '<p><a href="alarmDeal.html?alarm_id=' + res.Untreated_alarm[i].Id + '" target="_blank">' + n++ + '. ' + res.Untreated_alarm[i].Type + '</a></p>'
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