$(function() {
	// 加载页面公共部分
	me.util.layout();

	$.ajax({
        type: "GET",
        url: me.host("alarmHistory"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("alarmHistory ajax error!");
        },
        success: function(res) {
            initTable(res.data);
        }
    });

	function initTable(dataSet) {
		$('#table_id').DataTable({
	        "info": false,
	        "jQueryUI": true,
	        "data": dataSet,
	        "columns": [
	            { "title": "名称", "class": "center" },
	            { "title": "运行状态", "class": "center" },
	            { "title": "警告状态", "class": "center" },
	            { "title": "故障位置", "class": "center" }
	        ]
	    });
	};
});