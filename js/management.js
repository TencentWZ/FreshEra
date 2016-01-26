
$( document ).ready( function () {
	var bid = "123";
	var uid = "123";

	$.ajax({
		type: "GET",
		url: me.host("management"),
		dataType: "json",
		data: {
			bid: bid,
			uid: uid
		},
		error: function(res) {
			alert("服务器出错了，请联系相关维护人员");
		},
		success: function(res) {
			// 渲染大楼信息
			var buildingTitle = $('#building-title');
			var buildingContent = $('#building-content');
			var building = res.building;
			buildingTitle.append('<div>'+ building.name+ '</div>');
			buildingContent.append('<div>地址： ' + building.address + '<br>物业电话： ' + building.estatePhone + '<br>物业联系人： ' + building.estateContact + '<br>消防联系人： ' + building.fireContact + '<br>管理联系人： ' + building.managementContact +  '</div>');

			// 渲染用户信息
			var headshot = $('#headshot');
			var userContent = $('#userContent');
			var user = res.user;
			headshot[0].style['background-image'] = 'url(' + user.headshot +')';
			userContent.append('<div><h4>姓名： ' + user.name + '</h4></div><div>手机： ' + user.mobile + '</div><div>邮箱： ' + user.email + '<div>签到时间： ' + user.registerTime + '</div>');

			// 渲染报警信息
		    $('#warning').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="warningTable"></table>' );
		    $('#warningTable').dataTable( {
		        "data": res.warning.data,
		        "columns": [
		            { "title": "楼层" },
		            { "title": "设备类型" },
		            { "title": "当前状态" }
		        ],
				"bLengthChange": false,
				"bSort": false,
				"sScrollY": "180px",
				"bPaginate": false,
		        "searching": false,
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

			// 渲染设备状态
			$('#equipState').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="equipStateTable"></table>' );
		    $('#equipStateTable').dataTable( {
		        "data": res.equipState.data,
		        "columns": [
		            { "title": "楼层" },
		            { "title": "设备类型" },
		            { "title": "当前状态" }
		        ],
				"bLengthChange": false,
				"bSort": false,
				"sScrollY": "180px",
				"bPaginate": false,
		        "searching": false,
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
			// 渲染巡检情况
			var checkPercent = $('#checkPercent');
			var check = res.check;
			checkPercent.append('<div>当日巡检完成率： '+ check.dailyCheckPercent +'</div><div>当日巡检完成率： '+ check.monthlyCheckPercent +'</div><div>设备正常率： '+ check.normalEquipPercent +'</div>')
		}
	});
} );
