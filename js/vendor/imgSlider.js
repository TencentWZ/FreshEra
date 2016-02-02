
	// 加载页面公共部分
	me.util.layout();
	// 设置大楼ID为123
	var bid = getCookie('Bid');
	$.ajax({
		type: "GET",
		url: me.host("buildingPic"),
		dataType: "json",
		data: {
			bid: bid
		},
		error: function(res) {
			alert("服务器出错了，请联系相关维护人员");
		},
		success: function(res) {
			console.log(res);
			// 处理数据
			if (res.Data) {
				var data = res.Data;
				var imagebg = $('#imagebg');
				for (var i = 0; i < data.length; i++) {
					var li = "<li data-sPic=" + data[i].PhotoUrl + "><div class='bannerbg_main' style='background:url(" + data[i].PhotoUrl + ") 50% 50% no-repeat;width:990px;height:400px;'></div></li>";
					imagebg.append(li);
				}
			}
			init();
		}
	});
var image;
var init = function () {
	var img = {
		 imageNum: 5  ,
		 imageNumWidth:163,
		 num:0,
		 count:document.getElementById("imagebg").getElementsByTagName("li").length,
		 current:document.getElementById("current"),
		 imagebg:document.getElementById("imagebg"),
		 imagebg_li:document.getElementById("imagebg").getElementsByTagName("li"),
		 small_pic:document.getElementById("small_pic"),
		 imageShow:document.getElementById("imageShow"),
		 scrollbg:document.getElementById("scrollbg"),
		 left_img_btn:document.getElementById("left_img_btn"),
		 right_img_btn:document.getElementById("right_img_btn"),
		 small_pic_html:[],
		 animate:null,
		 autoplay:null,
		 init:function(){
			 img.imagebg.innerHTML = img.imagebg.innerHTML+img.imagebg.innerHTML+img.imagebg.innerHTML;
			for(var i=0;i<img.imagebg_li.length;i++){
				if(i!=0){
					img.small_pic_html.push("<li onclick='image.play("+i+")'><img src='"+img.imagebg_li[i].getAttribute("data-sPic")+"' style='width:145px;height:65px;'/></li>");
					img.imagebg.getElementsByTagName("li")[i].style.display ="none";
				}else{
					img.small_pic_html.push("<li onclick='image.play("+i+")' class='currently'><img src='"+img.imagebg_li[i].getAttribute("data-sPic")+"' style='width:145px;height:65px;'/></li>");
				}
			}
			img.small_pic.innerHTML = img.small_pic_html.join("");
			img.current.style.left = "77px";
			img.small_pic.style.left = "0px";
			img.imagebg_li[0].style.filter = "alpha(opacity=100)";
			img.imagebg_li[0].style.opacity = 1;
			img.left_img_btn.onclick = function(){img.play(img.num-1);}
			img.right_img_btn.onclick = function(){img.play(img.num+1)};
			// 去掉自动切换
			// img.autoplay= setInterval(function(){img.play(img.num+1)},5000);
			// img.imageShow.onmouseover = function(){clearInterval(img.autoplay);}
			// img.imageShow.onmouseout = function(){img.autoplay= setInterval(function(){img.play(img.num+1)},5000); }
		},
		play:function(i){
			var small_pic_left = parseInt(img.small_pic.style.left);
			var current_left = parseInt(img.current.style.left);
			var op = 0;
			if(i == img.num|| img.animate!=null || i>img.count*3 || i<-1){return;}
			for(var x=0;x<img.imagebg_li.length;x++){

				img.small_pic.getElementsByTagName("li")[x].className = "";
				img.imagebg_li[x].style.filter = "alpha(opacity="+op*10+")";
				img.imagebg_li[x].style.opacity = op/10;
				img.imagebg_li[x].style.display = "none";
			}
			if(i>(img.count*3-1)){
				i-=img.count;
				img.num -=img.count;

				img.small_pic.style.left = small_pic_left + img.imageNumWidth*(i-img.count) +"px" ;
				img.small_pic.getElementsByTagName("li")[i].className="currently";

				small_pic_left = parseInt(img.small_pic.style.left);
				current_left = parseInt(img.current.style.left);

			}else if(i<0){
				i+=img.count;
				img.num +=img.count;

				img.small_pic.style.left = small_pic_left - img.imageNumWidth*img.count +"px" ;
				img.small_pic.getElementsByTagName("li")[i].className="currently";

				small_pic_left = parseInt(img.small_pic.style.left);
				current_left = parseInt(img.current.style.left);
			}

			if(i>img.num){
				//如果比当前大;
				img.imagebg_li[i].style.display = "block";
				if(parseInt(img.current.style.left)>700){
					//如果活动框到了最右边--完成
					//小图片向左
					img.animate = setInterval(function(){
						if(parseInt(img.small_pic.style.left)>(small_pic_left- img.imageNumWidth*(i-img.num)+img.imageNumWidth*(i-img.num)/10)){
							img.small_pic.style.left = parseInt(img.small_pic.style.left) - img.imageNumWidth*(i-img.num)/10 +"px" ;
							img.imagebg_li[i].style.filter = "alpha(opacity="+(++op)*11+")";
							img.imagebg_li[i].style.opacity = op/9;
						}else{
							img.small_pic.style.left = small_pic_left - img.imageNumWidth*(i-img.num) +"px" ;
							img.small_pic.getElementsByTagName("li")[i].className="currently";
							clearInterval(img.animate);
							img.num = i;
							img.animate = null;
						}
					},30);
				}else{
					//活动框向右--完成
					img.animate = setInterval(function(){
						if(parseInt(img.current.style.left)<(current_left + img.imageNumWidth*(i-img.num)-img.imageNumWidth*(i-img.num)/10)){
							img.current.style.left = parseInt(img.current.style.left) + img.imageNumWidth*(i-img.num)/10 +"px" ;
							//为了IE联盟

							img.imagebg_li[i].style.filter = "alpha(opacity="+(++op)*11+")"; //"alpha(opacity=100)";

							//为了火狐部落
							img.imagebg_li[i].style.opacity = op/9;
						}else{
							img.current.style.left = current_left + img.imageNumWidth*(i-img.num) +"px" ;
							img.small_pic.getElementsByTagName("li")[i].className="currently";
							clearInterval(img.animate);
							img.num = i;
							img.animate = null;
						}
					},30);
				}

			}else if(i<img.num){
				img.imagebg_li[i].style.display = "block";
				//如果比当前小;
				if(parseInt(img.current.style.left)<100){
					//如果活动框到了最左边
					//小图片向右
					img.animate = setInterval(function(){
						//console.log(small_pic_left+"+"+ img.imageNumWidth*(img.num-i))
						if(parseInt(img.small_pic.style.left)<(small_pic_left- img.imageNumWidth*(i-img.num)+img.imageNumWidth*(i-img.num)/10)){
							img.small_pic.style.left = parseInt(img.small_pic.style.left) - img.imageNumWidth*(i-img.num)/10 +"px" ;
							img.imagebg_li[i].style.filter = "alpha(opacity="+(++op)*11+")";
							img.imagebg_li[i].style.opacity = op/9;
						}else{
							img.small_pic.style.left = small_pic_left - img.imageNumWidth*(i-img.num) +"px" ;
							img.small_pic.getElementsByTagName("li")[i].className="currently";
							clearInterval(img.animate);
							img.num = i;
							img.animate = null;
						}
					},30);
				}else{
					//活动框向左
					img.animate = setInterval(function(){
						if(parseInt(img.current.style.left)>(current_left - img.imageNumWidth*(img.num-i)+img.imageNumWidth*(img.num-i)/10)){
							img.current.style.left = parseInt(img.current.style.left) - img.imageNumWidth*(img.num-i)/10 +"px" ;
							img.imagebg_li[i].style.filter = "alpha(opacity="+(++op)*11+")";
							img.imagebg_li[i].style.opacity = op/9;
						}else{
							img.current.style.left = current_left - img.imageNumWidth*(img.num-i) +"px" ;
							img.small_pic.getElementsByTagName("li")[i].className="currently";
							clearInterval(img.animate);
							img.num = i;
							img.animate = null;
						}
					},30);
				}
			}
		}
	}
	// 初始化
	image = img;
	img.init();
	img.play(0);
};

	//阻止事件冒泡
	// function estop(e) {
	// 	var e = arguments.callee.caller.arguments[0] || event;
	// 	if (e && e.stopPropagation) {
	// 		//因此它支持W3C的stopPropagation()方法
	// 		e.stopPropagation();
	// 	} else {
	// 		//否则，我们需要使用IE的方式来取消事件冒泡
	// 		window.event.cancelBubble = true;
	// 		return false;
	// 	}
	// }
