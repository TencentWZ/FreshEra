
$(document).ready(function() {
    // 从后台获得数据，拼接html显示在页面上
    var bid = "123";
    $.ajax({
        type: "GET",
        url: me.host("baseData"),
        dataType: "json",
        data: {
            bid: bid
        },
        error: function(res) {
            alert("服务器错误，请联系相关维护人员");
        },
        success: function(res) {
            // 正文数据部分
            var buildingInfo = res.buildingInfo;
            var buildingdata = {
                'ChineseName': '',
                'EnglishName': '',
                'use': '',
                'completionDate': '',
                'id': '',
                'height': '',
                'officeFloor': '',
                'floorNumber': '',
                'wholeArea': '',
                'officeArea': '',
                'rentArea': '',
                'usePercent': '',
                'rentPercent': '',
                'underGarage': ''
            };
            var baseEquip = res.baseEquip;
            var baseEquipdata = {
                'floorHeight': '',
                'floorArea': '',
                'ceiling': '',
                'wall': '',
                'ground': '',
                'passengerElevator': '',
                'goodElevator': '',
                'airConditioner': '',
                'groundParkingSpace': '',
                'underParkingSpace': ''
            };
            render('buildingInfo', buildingInfo, 'modify', 'save', buildingdata, '123');
            render('baseEquip', baseEquip, 'modify2', 'save2', baseEquipdata, '123');
            // 侧栏部分
            
        }
    });

    // render方法
    var render = function(dom, indata, modify, save, outdata, url) {
        for (var item in indata) {
            if (indata.hasOwnProperty(item)) {
                $('#' + item).html(indata[item]);
            }
        }
        var modifyFlag = true;
        $("#" + modify).click(function(){
            if (modifyFlag) {
                for (var item in indata) {
                    if (indata.hasOwnProperty(item)) {
                        var tmp = $('#' + item);
                        var val = tmp[0].innerHTML;
                        tmp[0].innerHTML = "<input type='text' class=" + dom + " name="+ item + " value=" + val + " style='width:130px;'/>";
                    }
                }
            }
            modifyFlag = false;
        });

        $("#" + save).click(function(){
            // 提交数据
            $('.' + dom).each(function(){
                var value = $(this).val();
                var name = $(this).attr('name');
                outdata[name] = value;
                $('#' + name).html(value);
            });
            console.log(outdata);
            modifyFlag = true;
            // 上传数据
            // $.ajax({
            //     type: "GET",
            //     url: url,
            //     dataType: "json",
            //     data: outdata,
            //     error: function(res) {
            //         alert("服务器错误，请联系相关维护人员");
            //     },
            //     success: function(res) {
            //         alert("保存成功");
            //     }
            // });
        });
    };
});
