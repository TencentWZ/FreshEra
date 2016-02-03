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
            res.forEach(function(obj) {
                $("#equipment-type").append('<option value="' + obj.Sensortype + '">' + obj.Sensortype + '</option>');
            });
        }
    });

	function searching() {
		$.ajax({
	        type: "GET",
	        url: me.host("alarmHistory"),
	        dataType: "json",
	        data: {
	        	bid: bid,
	        	type: $("#equipment-type").val(),
	        	begin: $("#begin-time").val(),
	        	end: $("#end-time").val()
	        },
	        error: function(res) {
	            alert("alarmHistory ajax error!");
	        },
	        success: function(res) {
	            initTable(res);
	        }
	    });
	};

	$("#searching").on("click", function() {
		searching();
	});

	function initTable(dataSet) {
		if ($("#table_id_wrapper")) {
			$("#table_id_wrapper").remove();
			$("#main").append('<table id="table_id" class="display"></table>');
		};
		$('#table_id').DataTable({
	        "info": false,
        	"jQueryUI": false,
        	"ordering": false,
        	"searching": false,
        	"bLengthChange": false,
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
