$(function() {
	// 加载页面公共部分
	me.util.layout();
    var bid = getCookie('Bid');

	$.ajax({
        type: "GET",
        url: me.host("notalarmDeals"),
        dataType: "json",
        data: {
            bid: bid
        },
        error: function(res) {
            alert("notalarmDeals ajax error!");
        },
        success: function(res) {
            res.forEach(function(res) {
                if (res[2] == "0") {
                    res[2] = "正常";
                } else {
                    res[2] = "异常";
                };
                if (res[3] == "0") {
                    res[3] = "正常";
                } else {
                    res[3] = "异常";
                };
            });
            initTable(res);
        }
    });

	function initTable(dataSet) {
		$('#table_id').DataTable({
	        "info": false,
        	"jQueryUI": false,
        	"ordering": false,
        	"searching": false,
        	"bLengthChange": false,
	        "data": dataSet,
	        "columns": [
	            { "title": "传感器ID", "class": "center" },
 	            { "title": "传感器类型", "class": "center" },
  	            { "title": "运行状态", "class": "center" },
  	            { "title": "警告状态", "class": "center" },
 	            { "title": "开始警告", "class": "center" },
 	            { "title": "结束警告", "class": "center" },
 	            { "title": "楼层", "class": "center" },
                { "title": "位置", "class": "center" },
 	            { "title": "处理标记", "class": "center" }
	        ]
	    });
	};
});