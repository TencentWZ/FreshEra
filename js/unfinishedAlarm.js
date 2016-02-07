$(document).ready(function() {
    // 加载页面公共部分
    me.util.layout();

    // 得到基础数据
    var bid = getCookie('Bid');
    var unfinishedAlarmTableData;
    // 显示未处理的警告列表
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
            unfinishedAlarmTableData = res;
            res.forEach(function(res) {
                res[2] = (res[2] == "0") ? "正常" : "异常";
                res[3] = (res[3] == "0") ? "正常" : "异常";
            });
            // 将数据导入到table表中显示
            $('#unfinishedAlarm').html('<table cellpadding="0" cellspacing="0" border="0" class="row-border" id="unfinishedAlarmTable"></table>');
            var table = $('#unfinishedAlarmTable').dataTable({
                "data": res,
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
                }, {
                    "title": "预留位置1",
                    "class": "center"
                }, {
                    "title": "预留位置2",
                    "class": "center"
                }, {
                    "title": "告警ID",
                    "class": "center"
                }],
                "columnDefs": [{
                    "targets": [9],
                    "visible": false
                }, {
                    "targets": [10],
                    "visible": false
                }, {
                    "targets": [11],
                    "class": 'alarm_id',
                    "visible": false
                }],
                "bLengthChange": false,
                "bSort": false,
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
            });

            $('#unfinishedAlarmTable tbody').on('click', 'tr', function() {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                // 得到告警ID
                var equipId = $(this)[0].cells[0].innerHTML;
                // 不能直接获得隐藏列的值，因此先将其存到一个数据对象中
                var alarm_id;
                res.forEach(function(res) {
                    if (res[0] === equipId) {
                        alarm_id = res[11];
                    }
                });
                // 调出告警处理界面
                // 首先ajax获得内容，然后组装一个页面，然后显示出来
                $.ajax({
                    type: "GET",
                    url: me.host("alarmDealInit"),
                    dataType: "json",
                    data: {
                        bid: bid,
                        alarm_id: alarm_id
                    },
                    error: function(res) {
                        alert("alarmDeal ajax error!");
                    },
                    success: function(res) {
                        var width = parseFloat($(".alarmDeal-pic").css("width"));
                        var height = parseFloat($(".alarmDeal-pic").css("height"));
                        $("#myModalLabel").html("告警处理：" + res.Text);
                        $(".alarmDeal-pic").html("");
                        $(".alarmDeal-pic").css({
                            "background-image": "url('" + res.Url + "')",
                            "background-size": "auto 100%",
                            "background-position": "center",
                            "background-repeat": "no-repeat"
                        });
                        $(".alarmDeal-pic").append('' +
                            '<div class="state alerting" style="top:' + (res.Y * height - 3) + 'px;left:' + (res.X * width - 3) + 'px;"></div>'
                        );
                        buttonBind('submit01', '误报', alarm_id);
                        buttonBind('submit02', '末端水压异常', alarm_id);
                        buttonBind('submit03', '常闭门未关闭', alarm_id);
                        buttonBind('submit04', '消防通道堵塞', alarm_id);
                        buttonBind('submit05', '火警', alarm_id);
                        buttonBind('submit06', '其他', alarm_id, true);

                        $('#myModal').modal('show');
                    }
                });
            });
        }
    });
    function buttonBind (bname, btitle, alarm_id, isSepcial) {

        $("#" + bname).on("click", function() {
            if (isSepcial) {
                buttonBind('submit07', '', alarm_id);
                $('#myModal').modal('hide');
                $('#reasonInputModal').modal('show');
                return;

            }
            if (bname === 'submit07') {
                if ($('#reasonInput').val()) {
                    btitle = $('#reasonInput').val();
                } else {
                    alert("请输入原因");
                    return;
                }
            }
            $.ajax({
                type: "GET",
                url: me.host("alarmDeal"),
                dataType: "json",
                data: {
                    bid: bid,
                    alarm_id: alarm_id,
                    deal_type: btitle
                },
                error: function(res) {
                    alert("alarmDeal ajax error!");
                },
                success: function(res) {
                    if (res.Code == "0") {
                        alert("处理成功！");
                    } else {
                        alert("处理失败！");
                    }
                    $('#myModal').modal('hide');
                    $('#reasonInputModal').modal('hide');
                    // 刷新页面
                    location.reload();
                }
            });
        });
    }
});
