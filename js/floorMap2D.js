$(function() {
	// 加载页面公共部分
	me.util.layout();

    // 初始化巡检点
	$.ajax({
        type: "GET",
        url: me.host("floorMapInit"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("ajax error!");
        },
        success: function(res) {
            var width = parseFloat($("#map").css("width"));
            var height = parseFloat($("#map").css("height"));
            var equipmentArr = res.equipmentPoint;
            var inspectArr = res.inspectPoint;
            console.log(equipmentArr);
            equipmentArr.forEach(function(obj) {
                $("#map").append('' +
                    '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" floor="' + obj.floor + '" type="' + obj.type + '" name="' + obj.name + '" ></div>' + 
                    '<div class="state alert" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" floor="' + obj.floor + '" type="' + obj.type + '" name="' + obj.name + '" ></div>'
                );
            });
            console.log(inspectArr);
            inspectArr.forEach(function(obj) {
                $("#map").append('' +
                    '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" floor="' + obj.floor + '" stat="' + obj.stat + '" name="' + obj.name + '" ></div>' + 
                    '<div class="state alert" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" floor="' + obj.floor + '" stat="' + obj.stat + '" name="' + obj.name + '" ></div>'
                );
            });
















        }
    });

});
