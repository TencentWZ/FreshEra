$(function() {
	// 加载页面公共部分
	me.util.layout();
	var bid = getCookie('Bid');
	$('#begin-time').datepicker({ dateFormat: "yy-mm-dd" });
	$('#end-time').datepicker({ dateFormat: "yy-mm-dd" });
	$.ajax({
        type: "GET",
        url: me.host("alarmdealstype"),
        dataType: "json",
        data: {},
        error: function(res) {
            alert("alarmdealstype ajax error!");
        },
        success: function(res) {
			var arrLength = res.length;
			var tmp = {
				Sensortype: "不选择"
			};
			res.unshift(tmp);
            res.forEach(function(obj) {
                $("#equipment-type").append('<option value="' + obj.Sensortype + '">' + obj.Sensortype + '</option>');
            });
        }
    });
	// 初始化运行一次
	search("","","","");
	// 监听点击事件
	$("#searching").on("click", function() {
		var type;
		if ($("#equipment-type").val() == '不选择') {
			type = "";
		} else {
			type = $("#equipment-type").val();
		}
		var begin = formatDate($("#begin-time").val()) ? formatDate($("#begin-time").val()) : "";
		var end = formatDate($("#end-time").val()) ? formatDate($("#end-time").val()) : "";
		console.log(type, begin, end);
		search(bid, type, begin, end);
	});

	// 数据获得
	function search (bid, type, begin, end) {
		$.ajax({
	        type: "GET",
	        url: me.host("alarmHistory"),
	        dataType: "json",
	        data: {
	        	bid: bid,
	        	type: type,
	        	begin: begin,
	        	end: end
	        },
	        error: function(res) {
	            alert("alarmHistory ajax error!");
	        },
	        success: function(res) {
				console.log(res);
				$('#alarm-search').html( '<table cellpadding="0" cellspacing="0" border="0" class="row-border" id="alarmSearchTable"></table>' );
			    $('#alarmSearchTable').dataTable( {
			        "data": res,
			        "columns": [
						{ "title": "传感器ID", "class": "center" },
			            { "title": "传感器类型", "class": "center" },
			            { "title": "运行状态", "class": "center" },
			            { "title": "警告状态", "class": "center" },
			            { "title": "开始警告", "class": "center" },
			            { "title": "结束警告", "class": "center" },
			            { "title": "楼层", "class": "center" },
			            { "title": "位置", "class": "center" },
			            { "title": "处理标记", "class": "center" },
			            { "title": "告警原因", "class": "center" },
			            { "title": "处理时间", "class": "center" }
			        ],
					"bSort": false,
			        "searching": false,
					"bLengthChange": false,
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
			    } );
	        }
	    });
	}
	// 初始化表
	// function initTable(dataSet) {
	// 	// if ($("#table_id_wrapper")) {
	// 	// 	$("#table_id_wrapper").remove();
	// 	// 	$("#main").append('<table id="table_id" class="display"></table>');
	// 	// }
	// 	$('#table_id').DataTable({
	// 		"data": dataSet,
	// 		"columns": [
	// 			{ "title": "传感器ID", "class": "center" },
	//             { "title": "传感器类型", "class": "center" },
	//             { "title": "运行状态", "class": "center" },
	//             { "title": "警告状态", "class": "center" },
	//             { "title": "开始警告", "class": "center" },
	//             { "title": "结束警告", "class": "center" },
	//             { "title": "楼层", "class": "center" },
	//             { "title": "位置", "class": "center" },
	//             { "title": "处理标记", "class": "center" },
	//             { "title": "告警原因", "class": "center" },
	//             { "title": "处理时间", "class": "center" }
	// 		],
	// 		"bLengthChange": false,
	// 		"bSort": false,
	// 		"bPaginate": false,
	// 		"searching": false,
	// 		"oLanguage": {
	// 			"sLengthMenu": "每页显示 _MENU_ 条记录",
	// 			"sZeroRecords": "对不起，查询不到任何相关数据",
	// 			"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
	// 			"sInfoEmtpy": "找不到相关数据",
	// 			"sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
	// 			"sProcessing": "正在加载中...",
	// 			"sSearch": "搜索",
	// 			"sUrl": "", //多语言配置文件，可将oLanguage的设置放在一个txt文件中，例：Javascript/datatable/dtCH.txt
	// 			"oPaginate": {
	// 				"sFirst": "第一页",
	// 				"sPrevious": " 上一页 ",
	// 				"sNext": " 下一页 ",
	// 				"sLast": " 最后一页 "
	// 			}
	// 		}
	//     });
	// }
	// 日期格式化  2016-02-02 -->2016-2-2
	function formatDate (date) {
		var dateArr = date.split('-');
		var result;
		for (var i = 0; i < dateArr.length; i++) {
			if (i !== 0) {
				result = result + '-' + parseInt(dateArr[i]);
			} else {
				result = parseInt(dateArr[i]);
			}
		}
		return result;
	}

});
