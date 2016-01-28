/* Tab切换 */
var spin = $('#spritespin');
selectorInit(init3DFloor, '-3d');
$(function() {
    $('#floorTab a').click(function(e) {
        // Tab初始化
        e.preventDefault();
		if ($('this').prevObject[0].activeElement.id == '2d_tab') {
			$('#floor-select-2d').html('');
			selectorInit(init2DFloor, '-2d');
			// 必须对spin进行初始化，才能保证一直有点
			spin.unbind('onLoad');
			spin.unbind('onFrame');
			$("#details").append('<div class="detail detail-0"></div>');
			$("#details").append('<div class="detail detail-12"></div>');
		} else  {
			$('#floor-select-3d').html('');
			selectorInit(init3DFloor, '-3d');
		}
        $(this).tab('show');
    });
});

/* 3D渲染方法 */
var threeDInit = function(urlArr, spin) {
    var frames = SpriteSpin.sourceArray(urlArr[0] + '/' + '{frame}' + '.' + urlArr[1], {
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
        width: 733,
        sense: -1,
        height: 550,
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
};

/* 选择器初始化 */
function selectorInit (initFloor, dimension)  {
	/* 选择框渲染 */
	$.ajax({
	    type: "GET",
	    url: me.host("floorMapBasic"),
	    dataType: "json",
	    data: {},
	    error: function(res) {
	        alert("floorName ajax error!");
	    },
	    success: function(res) {
	        checkboxInit(res.equipment_type, dimension);
	        for (var i in res.floor) {
	            $("#floor-select" + dimension ).append('<option value="' + i + '">' + res.floor[i] + '</option>');
	        };
	        initFloor($("#floor-select" + dimension ).val());
	        $("#floor-select" + dimension).on("change", function() {
	            initFloor($("#floor-select" + dimension ).val());
	        });
	    }
	});
}

/* 2D点渲染 */
function init2DFloor(floor) {
    $.ajax({
        type: "GET",
        url: me.host("floorMapInit"),
        dataType: "json",
        data: {
            floor: floor
        },
        error: function(res) {
            alert("floorMapInit ajax error!");
        },
        success: function(res) {
			var width = parseFloat($(".map").css("width"));
			var height = parseFloat($(".map").css("height"));
			$(".map").css("background-image", "url(" + res.url + ")");
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
        }
    });
};

function checkboxInit(checkboxArr, dimension) {
    $("#checkbox-equipment" + dimension).html('<p class="p-title">挑选相关设备</p>');
    checkboxArr.forEach(function(obj) {
        $("#checkbox-equipment" + dimension).append('<p><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj + '" id="' + obj + '" /><label for="' + obj + '">' + obj + '</label></p>');
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

/* 3D点渲染 */
function init3DFloor(floor) {

	// spin.html('');
	spin.unbind('onLoad');
	spin.unbind('onFrame');

    $.ajax({
        type: "GET",
        url: me.host("floor3DMapInit"),
        dataType: "json",
        data: {
            floor: floor
        },
        error: function(res) {
            console.log(res);
        },
        success: function(res) {
			// 正则匹配url
			var re = /\/[0-9]+./g;
			var urlArr = res.url.split(re);
			var width = parseFloat($("#spritespin").css("width"));
			var height = parseFloat($("#spritespin").css("height"));
			// 将素材赋给3D旋转图
			console.log(spin);
			threeDInit(urlArr, spin);
            res.point.forEach(function(obj) {
                if (obj.point_type == "equipment") {
                    $(".detail-0").append('' +
                        '<div class="state normal" style="top:' + (obj.fronty * height - 5) + 'px;left:' + (obj.frontx * width - 5) + 'px;" id="' + obj.id + '" point_type="equipment" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                    );
					$(".detail-12").append('' +
                        '<div class="state normal" style="top:' + (obj.backy * height - 5) + 'px;left:' + (obj.backx * width - 5) + 'px;" id="' + obj.id + '" point_type="equipment" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                    );
                } else if (obj.point_type == "inspect") {
                    $(".detail-0").append('' +
                        '<div class="state normal" style="top:' + (obj.fronty * height - 5) + 'px;left:' + (obj.frontx * width - 5) + 'px;" id="' + obj.id + '" point_type="inspect" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                    );
					$(".detail-12").append('' +
                        '<div class="state normal" style="top:' + (obj.backy * height - 5) + 'px;left:' + (obj.backx * width - 5) + 'px;" id="' + obj.id + '" point_type="inspect" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                    );
                };
            });
        }
    });
};
