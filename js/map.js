// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 15);
// 编写自定义函数,创建标注
function addMarker(point){
  var marker = new BMap.Marker(point);
marker.addEventListener("click",attribute);
  map.addOverlay(marker);
function attribute(){
    var p = marker.getPosition();  //获取marker的位置
    alert("marker的位置是" + p.lng + "," + p.lat);
}
}
// 随机向地图添加25个标注
var bounds = map.getBounds();
var sw = bounds.getSouthWest();
var ne = bounds.getNorthEast();
var lngSpan = Math.abs(sw.lng - ne.lng);
var latSpan = Math.abs(ne.lat - sw.lat);
for (var i = 0; i < 25; i ++) {
    var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
    addMarker(point);
}
