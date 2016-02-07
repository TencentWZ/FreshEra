$(function() {
	// 加载页面公共部分
	me.util.layout();
    var bid = getCookie('Bid');

	$.ajax({
		type: "GET",
		url: me.host("patrolState"),
		dataType: "json",
		data: {
			bid: bid
		},
		error: function(res) {
			alert("patrolState ajax error!");
		},
		success: function(res) {
			// 将数据导入到table表中显示
			$('#patrolState').html('<table cellpadding="0" cellspacing="0" border="0" class="row-border" id="patrolStateTable"></table>');
			$('#patrolStateTable').dataTable({
				"data": res,
				"columns": [
					{ "title": "设备ID", "class": "center" },
	 	            { "title": "设备名称", "class": "center" },
	  	            { "title": "楼层", "class": "center" },
	  	            { "title": "设备位置", "class": "center" },
	 	            { "title": "巡检频率", "class": "center" },
	 	            { "title": "过期时间", "class": "center" },
	 	            { "title": "是否故障", "class": "center" },
	 	            { "title": "故障原因", "class": "center" }
				],
				"bLengthChange": false,
				"bSort": true,
				"searching": true,
				"oLanguage": {
					"sLengthMenu": "每页显示 _MENU_ 条记录",
					"sZeroRecords": "对不起，查询不到任何相关数据",
					"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
					"sInfoEmtpy": "找不到相关数据",
					"sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
					"sProcessing": "正在加载中...",
					"sSearch": "搜索",
					"sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
					"oPaginate": {
						"sFirst": "第一页",
						"sPrevious": " 上一页 ",
						"sNext": " 下一页 ",
						"sLast": " 最后一页 "
					}
				}
			});
		}
	});
});
