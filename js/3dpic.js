// 定义图片组
var frames = SpriteSpin.sourceArray('css/images/{frame}.jpg', {
    frame: [1, 24],
    digits: 2
});

// 要停留的图片
var details = [0, 20];
var detailIndex = 0;

// 初始化
var spin = $('#spritespin');
spin.spritespin({
    source: frames,
    width: 707,
    sense: -1,
    height: 500,
    animate: false
});
// 得到api
var api = spin.spritespin("api");

spin.bind("onLoad", function(){
    var data = api.data;
    data.stage.prepend($(".details .detail"));
    data.stage.find(".detail").hide();
}).bind("onFrame", function(){
    var data = api.data;
    data.stage.find(".detail:visible").stop(false).fadeOut();
    data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
});

// $( "#prev" ).click(function(){
//     setDetailIndex(detailIndex - 1);
// });

$( "#next" ).click(function(){
    setDetailIndex(detailIndex + 1);
});

function setDetailIndex(index){
    detailIndex = index;
    if (detailIndex < 0){
        detailIndex = details.length - 1;
    }
    if (detailIndex >= details.length){
        detailIndex = 0;
    }
    api.playTo(details[detailIndex]);
}
