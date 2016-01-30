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
				demoTest: './mock/demoTest.json?v=' + Math.random(),
				floorMapInit: './mock/floorMapInit.json?v=' + Math.random(),
				floorMapMonitor: './mock/floorMapMonitor.json?v=' + Math.random(),
				floorMapBasic: './mock/floorMapBasic.json?v=' + Math.random(),
				untreatedAlarm: './mock/untreatedAlarm.json?v=' + Math.random(),
				patrolState: './mock/patrolState.json?v=' + Math.random(),
				alarmHistory: './mock/alarmHistory.json?v=' + Math.random(),
				alarmDeal: './mock/alarmDeal.json?v=' + Math.random(),
				baseData: './mock/baseData.json?v=' + Math.random(),
				buildingPic: './mock/buildingPic.json?v=' + Math.random(),
				login: './mock/login.json?v=' + Math.random(),
				management: './mock/management.json?v=' + Math.random(),
				floor3DMapInit: './mock/floor3DMapInit.json?v=' + Math.random()
			},
			pro: {
				demoTest: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				floorMapInit: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				floorMapMonitor: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				floorMapBasic: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				untreatedAlarm: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				patrolState: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				alarmHistory: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				alarmDeal: 'http://xxx.xxx.xxx/xxxxx?v=' + Math.random(),
				login: 'accounts/login.aspx',
				management: 'accounts/management.aspx',
				baseData: 'accounts/infoall.aspx',
				buildingPic: 'accounts/buildingPic.aspx',
				floor3DMapInit: 'accounts/floorPic.aspx'
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

	};
	Layout.prototype.menu = function () {
		// 侧栏初始化函数
		;
		( function ( $, window, document, undefined ) {
			if ( $( 'ul.mtree' ).length ) {
				var collapsed = true;
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
		$( "#header" ).load( "layout/header.html", {}, function () {
			me.layout.header();
		} );
		$( "#search-data").load( "layout/search.html", {}, function() {
			me.layout.search();
		});
		$( "#menu" ).load( "layout/menu.html", {}, function () {
			me.layout.menu();
		} );
		$( "#footer" ).load( "layout/footer.html" );
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
