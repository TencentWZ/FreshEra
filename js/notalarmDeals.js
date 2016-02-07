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
                res[2] = (res[2] == "0") ? "正常" : "异常";
                res[3] = (res[3] == "0") ? "正常" : "异常";
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
            "columns": [{
                "title": "传感器ID",
                "class": "center"
            }, {
                "title": "传感器类型",
                "class": "center"
            }, {
                "title": "运行状态",
                "class": "center"
            }, {
                "title": "警告状态",
                "class": "center"
            }, {
                "title": "开始警告",
                "class": "center"
            }, {
                "title": "结束警告",
                "class": "center"
            }, {
                "title": "楼层",
                "class": "center"
            }, {
                "title": "位置",
                "class": "center"
            }, {
                "title": "处理标记",
                "class": "center"
            }]
        });
        $('#table_id tbody').on('click', 'tr', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    }
});
