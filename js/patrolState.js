$(function() {
	// 加载页面公共部分
	me.util.layout();

	$.ajax({
        type: "GET",
        url: me.host("patrolState"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("patrolState ajax error!");
        },
        success: function(res) {
            initTable(res.data);
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
	            { "title": "设备ID", "class": "center" },
 	            { "title": "设备名称", "class": "center" },
  	            { "title": "楼层", "class": "center" },
  	            { "title": "设备位置", "class": "center" },
 	            { "title": "巡检频率", "class": "center" },
 	            { "title": "过期时间", "class": "center" },
 	            { "title": "是否故障", "class": "center" },
 	            { "title": "故障原因", "class": "center" }
	        ]
	    });
	};
});