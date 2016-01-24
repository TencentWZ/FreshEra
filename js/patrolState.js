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
	        "jQueryUI": true,
	        "data": dataSet,
	        "columns": [
	            { "title": "标签", "class": "center" },
	            { "title": "名称", "class": "center" },
	            { "title": "楼层", "class": "center" },
	            { "title": "状态", "class": "center" },
	            { "title": "最后巡检日期", "class": "center" },
	            { "title": "故障原因", "class": "center" },
	            { "title": "整改方式", "class": "center" },
	            { "title": "验收状态", "class": "center" },
	            { "title": "下次巡检时间", "class": "center" },
	            { "title": "图片", "class": "center" },
	            { "title": "操作", "class": "center" }
	        ]
	    });
	};
});