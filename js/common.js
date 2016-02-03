// core: me
;
( function ( window, $ ) {
	window.me = {};
} )( window, window.jQuery || window.Zepto );

// host
;
( function ( me, $ ) {
	var env = "pro"; // 测试环境与正式环境切换开关
	var host = function ( name ) {
		var url = {
			mock: {
				floorMapInit: './mock/floorMapInit.json?v=' + Math.random(),
				floorMapMonitor: './mock/floorMapMonitor.json?v=' + Math.random(),
				floorMapBasic: './mock/floorMapBasic.json?v=' + Math.random(),
				patrolState: './mock/patrolState.json?v=' + Math.random(),
				alarmHistory: './mock/alarmHistory.json?v=' + Math.random(),
				alarmDealInit: './mock/alarmDealInit.json?v=' + Math.random(),
				alarmDeal: './mock/alarmDeal.json?v=' + Math.random(),
				baseData: './mock/baseData.json?v=' + Math.random(),
				buildingPic: './mock/buildingPic.json?v=' + Math.random(),
				login: './mock/login.json?v=' + Math.random(),
				management: './mock/management.json?v=' + Math.random(),
				floor3DMapInit: './mock/floor3DMapInit.json?v=' + Math.random()
			},
			pro: {
				floorMapInit: 'accounts/floorMapInit.aspx',
				floorMapMonitor: 'accounts/floorMapMonitor.aspx?building_id=151104001&floor_id=F1',
				floorMapBasic: 'accounts/floorMapBasic.aspx',
				patrolState: 'accounts/patrolState.aspx?building_id=151104001',
				alarmHistory: 'accounts/alarmDeals.aspx?building_id=151104001',
				alarmDealInit: 'accounts/alarmDealInit.aspx?building_id=151104001&alarm_id=1',
				alarmDeal: 'accounts/alarmDeal.aspx?building_id=151104001&alarm_id=1&deal_type=误报',
				login: 'accounts/login.aspx',
				management: 'accounts/management.aspx',
				baseData: 'accounts/infoall.aspx',
				buildingPic: 'accounts/buildingPic.aspx',
				floor3DMapInit: 'accounts/floorPic.aspx',
				save: 'accounts/upbuildingInfo.aspx',
				save2: 'accounts/upbaseEquip.aspx',
				notice: 'accounts/notice.aspx'
			}
		};
		return url[ env ][ name ] || null;
	};
	me.host = host;
} )( me, window.jQuery || window.Zepto );

// layout
;
( function ( me, $ ) {
	var Layout = function () {};
	Layout.prototype.header = function () {

	};
	Layout.prototype.search = function () {
		var bid = getCookie('Bid');
		var uid = getCookie('Userid');
		$.ajax({
			type: "GET",
			url: me.host("management"),
			dataType: "json",
			data: {
				bid: bid,
				uid: uid
			},
			error: function(res) {
				//alert("服务器出错了，请联系相关维护人员");
			},
			success: function(res) {
				var buildingContent = $('#search-content');
				var building = res.Building;
				buildingContent.append('<div><h4>'+ building.Name+ '</h4></div><div>地址： ' + building.Address + '<br>物业电话： ' + building.Estataphone + '<br>物业联系人： ' + building.EstateContact + '<br>消防联系人： ' + building.FireContact + '<br>管理联系人： ' + building.ManagementContact +  '</div>');
			}
		});
	};
	Layout.prototype.menu = function () {
		// 侧栏初始化函数
		;
		( function ( $, window, document, undefined ) {
			if ( $( 'ul.mtree' ).length ) {
				var collapsed = false;
				var close_same_level = false;
				var duration = 400;
				var listAnim = true;
				var easing = 'easeOutQuart';
				$( '.mtree ul' ).css( {
					'overflow': 'hidden',
					'height': collapsed ? 0 : 'auto',
					'display': collapsed ? 'none' : 'block'
				} );
				var node = $( '.mtree li:has(ul)' );
				node.each( function ( index, val ) {
					$( this ).children( ':first-child' ).css( 'cursor', 'pointer' );
					$( this ).addClass( 'mtree-node mtree-' + ( collapsed ? 'closed' : 'open' ) );
					$( this ).children( 'ul' ).addClass( 'mtree-level-' + ( $( this ).parentsUntil( $( 'ul.mtree' ), 'ul' ).length + 1 ) );
				} );
				$( '.mtree li > *:first-child' ).on( 'click.mtree-active', function ( e ) {
					if ( $( this ).parent().hasClass( 'mtree-closed' ) ) {
						$( '.mtree-active' ).not( $( this ).parent() ).removeClass( 'mtree-active' );
						$( this ).parent().addClass( 'mtree-active' );
					} else if ( $( this ).parent().hasClass( 'mtree-open' ) ) {
						$( this ).parent().removeClass( 'mtree-active' );
					} else {
						$( '.mtree-active' ).not( $( this ).parent() ).removeClass( 'mtree-active' );
						$( this ).parent().toggleClass( 'mtree-active' );
					}
				} );
				node.children( ':first-child' ).on( 'click.mtree', function ( e ) {
					var el = $( this ).parent().children( 'ul' ).first();
					var isOpen = $( this ).parent().hasClass( 'mtree-open' );
					if ( ( close_same_level || $( '.csl' ).hasClass( 'active' ) ) && !isOpen ) {
						var close_items = $( this ).closest( 'ul' ).children( '.mtree-open' ).not( $( this ).parent() ).children( 'ul' );
						if ( $.Velocity ) {
							close_items.velocity( {
								height: 0
							}, {
								duration: duration,
								easing: easing,
								display: 'none',
								delay: 100,
								complete: function () {
									setNodeClass( $( this ).parent(), true );
								}
							} );
						} else {
							close_items.delay( 100 ).slideToggle( duration, function () {
								setNodeClass( $( this ).parent(), true );
							} );
						}
					}
					el.css( {
						'height': 'auto'
					} );
					if ( !isOpen && $.Velocity && listAnim )
						el.find( ' > li, li.mtree-open > ul > li' ).css( {
							'opacity': 0
						} ).velocity( 'stop' ).velocity( 'list' );
					if ( $.Velocity ) {
						el.velocity( 'stop' ).velocity( {
							height: isOpen ? [
								0,
								el.outerHeight()
							] : [
								el.outerHeight(),
								0
							]
						}, {
							queue: false,
							duration: duration,
							easing: easing,
							display: isOpen ? 'none' : 'block',
							begin: setNodeClass( $( this ).parent(), isOpen ),
							complete: function () {
								if ( !isOpen )
									$( this ).css( 'height', 'auto' );
							}
						} );
					} else {
						setNodeClass( $( this ).parent(), isOpen );
						el.slideToggle( duration );
					}
					e.preventDefault();
				} );

				function setNodeClass( el, isOpen ) {
					if ( isOpen ) {
						el.removeClass( 'mtree-open' ).addClass( 'mtree-closed' );
					} else {
						el.removeClass( 'mtree-closed' ).addClass( 'mtree-open' );
					}
				}
				if ( $.Velocity && listAnim ) {
					$.Velocity.Sequences.list = function ( element, options, index, size ) {
						$.Velocity.animate( element, {
							opacity: [
								1,
								0
							],
							translateY: [
								0, -( index + 1 )
							]
						}, {
							delay: index * ( duration / size / 2 ),
							duration: duration,
							easing: easing
						} );
					};
				}
				if ( $( '.mtree' ).css( 'opacity' ) == 0 ) {
					if ( $.Velocity ) {
						$( '.mtree' ).css( 'opacity', 1 ).children().css( 'opacity', 0 ).velocity( 'list' );
					} else {
						$( '.mtree' ).show( 200 );
					}
				}
			}
		}( jQuery, this, this.document ) );
	};
	me.layout = new Layout();
} )( me, window.jQuery || window.Zepto );

// util
;
( function ( me, $ ) {
	var Util = function () {};
	Util.prototype.layout = function () {
		$.get("./layout/header.html", function (result) {
 			$( "#header" ).append(result);
  			me.layout.header();
  		} );
		$.get("./layout/search.html", function (result) {
 			$( "#search-data" ).append(result);
  			me.layout.search();
 		} );
		$.get("./layout/menu.html", function (result) {
 			$( "#menu" ).append(result);
  			me.layout.menu();
  		} );
		$.get("./layout/footer.html", function (result) {
 			$( "#footer" ).append(result);
 		} );
	};
	me.util = new Util();
} )( me, window.jQuery || window.Zepto );

// 兼容ie
if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

// Tips
function Tips(text) {
	var x = $(this).offset().left + 20, y = $(this).offset().top;
	$(this).off()
	$(this).on("mouseover", function() {
		$("body").append('' +
			'<div class="tips" style="top:' + y + 'px;left:' + x + 'px;">' + text + '</div>'
		);
	});
    $(this).on("mouseout", function() {
		$(".tips").remove();
	});
};
$.fn.tips = Tips;
