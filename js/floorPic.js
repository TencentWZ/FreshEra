/* Tab切换 */
var bid = getCookie( 'Bid' );
var spin = $( '#spritespin' );
selectorInit( init3DFloor, '-3d' );

$( function () {
	$( '#floorTab a' ).click( function ( e ) {
		// Tab初始化
		e.preventDefault();
		if ( $( 'this' ).prevObject[ 0 ].activeElement.id == '2d_tab' ) {
			$( '#floor-select-2d' ).html( '' );
			selectorInit( init2DFloor, '-2d' );
			// 必须对spin进行初始化，才能保证一直有点
			spin.unbind( 'onLoad' );
			spin.unbind( 'onFrame' );
			$( "#details" ).append( '<div class="detail detail-0"></div>' );
			$( "#details" ).append( '<div class="detail detail-12"></div>' );
		} else {
			$( '#floor-select-3d' ).html( '' );
			selectorInit( init3DFloor, '-3d' );
		}
		$( this ).tab( 'show' );
	} );
} );

/* 3D渲染方法 */
var threeDInit = function ( urlArr, spin ) {
	var frames = SpriteSpin.sourceArray( urlArr[ 0 ] + '3D/' + '{frame}' + '.' + urlArr[ 1 ], {
		frame: [ 1, 24 ],
		digits: 2
	} );
	// 要停留的图片
	var details = [ 0, 12 ];
	var detailIndex = 0;
	// 初始化
	// spin.removeAttr("class");
	spin.spritespin( {
		source: frames,
		width: 733,
		sense: -1,
		height: 550,
		animate: false
	} );
	// 得到api
	var api = spin.spritespin( "api" );
	spin.bind( "onLoad", function () {
		var data = api.data;
		data.stage.prepend( $( ".details .detail" ) );
		data.stage.find( ".detail" ).hide();
	} ).bind( "onFrame", function () {
		var data = api.data;
		data.stage.find( ".detail:visible" ).stop( false ).fadeOut();
		data.stage.find( ".detail.detail-" + data.frame ).stop( false ).fadeIn();
	} );
	$( "#next" ).click( function () {
		setDetailIndex( detailIndex + 1 );
	} );

	function setDetailIndex( index ) {
		detailIndex = index;
		if ( detailIndex < 0 ) {
			detailIndex = details.length - 1;
		}
		if ( detailIndex >= details.length ) {
			detailIndex = 0;
		}
		api.playTo( details[ detailIndex ] );
	}
	$( "#details" ).append( '<div class="detail detail-0"></div>' );
	$( "#details" ).append( '<div class="detail detail-12"></div>' );
};

/* 选择器初始化 */
function selectorInit( initFloor, dimension ) {

	/* 选择框渲染 */
	$.ajax( {
		type: "GET",
		url: me.host( "floorMapBasic" ),
		dataType: "json",
		data: {
			bid: bid
		},
		error: function ( res ) {
			alert( "floorName ajax error!" );
		},
		success: function ( res ) {
			checkboxInit( res.Ty, dimension );
			for ( var i in res.Floor ) {
				if ( i == 0 ) {
					$( "#floor-select" + dimension ).append( '<option value="' + res.Floor[ i ].Floorid + '" selected>' + res.Floor[ i ].Floorname + '</option>' );
				} else {
					$( "#floor-select" + dimension ).append( '<option value="' + res.Floor[ i ].Floorid + '">' + res.Floor[ i ].Floorname + '</option>' );
				}
			}
			initFloor( $( "#floor-select" + dimension ).val() );
			$( "#floor-select" + dimension ).on( "change", function () {
				initFloor( $( "#floor-select" + dimension ).val() );
			} );
		}
	} );
}

/* 2D点渲染 */
function init2DFloor( floor ) {
	$.ajax( {
		type: "GET",
		url: me.host( "floorMapInit" ),
		dataType: "json",
		data: {
			floor_id: floor[0],
			bid: bid,
			picType: "平面图"
		},
		error: function ( res ) {
			console.log(res);
			alert( "floorMapInit ajax error!" );
		},
		success: function ( res ) {
			console.log(res);
			var width = parseFloat( $( ".map" ).css( "width" ) );
			var height = parseFloat( $( ".map" ).css( "height" ) );
			$( ".map" ).css( "background-image", "url(" + res.Url + ")" );
			$( ".map" ).html( '' );
			res.Point.forEach( function ( obj ) {
				if ( obj.Point_type == "传感器" ) {
					$( ".map" ).append( '' +
						'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
					);
				} else if ( obj.Point_type == "巡检点" ) {
					$( ".map" ).append( '' +
						'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
					);
				};
			} );
		}
	} );
};

function checkboxInit( checkboxArr, dimension ) {
	$( "#checkbox-equipment" + dimension ).html( '<p class="p-title">挑选相关设备</p>' );
	checkboxArr.forEach( function ( obj ) {
		$( "#checkbox-equipment" + dimension ).append( '<p><input class="checkbox-item" type="checkbox" point_type="传感器" value="' + obj.Name + '" id="' + obj.Name + '" /><label for="' + obj.Name + '">' + obj.Name + '</label></p>' );
	} );
	$( ".checkbox-item" ).on( "change", function () {
		var point_type = $( this ).attr( "point_type" );
		if ( point_type == "传感器" ) {
			$( ".checkbox-item[point_type='巡检点']" ).prop( "checked", false );
		} else if ( point_type == "巡检点" ) {
			$( ".checkbox-item[point_type='传感器']" ).prop( "checked", false );
		};
		$( ".state" ).hide();
		var all = document.getElementsByClassName( "checkbox-item" );
		for ( var i = 0; i < all.length; i++ ) {
			if ( all[ i ].checked == true ) {
				$( ".state[equipment_type='" + all[ i ].value + "']" ).show();
			};
		};
	} );
};

/* 3D点渲染 */
function init3DFloor( floor ) {

	// spin.html('');
	spin.unbind( 'onLoad' );
	spin.unbind( 'onFrame' );
	$.ajax( {
		type: "GET",
		url: me.host( "floor3DMapInit" ),
		dataType: "json",
		data: {
			floor: floor[ 0 ],
			bid: bid,
			picType: "3D图"
		},
		error: function ( res ) {
			alert( "ajax error" );
		},
		success: function ( res ) {
			// 正则匹配url
			var re = /3D\/[0-9]+./g;
			var urlArr = res.Url.split( re );
			var width = parseFloat( $( "#spritespin" ).css( "width" ) );
			var height = parseFloat( $( "#spritespin" ).css( "height" ) );
			// 将素材赋给3D旋转图
			threeDInit( urlArr, spin );
			res.Point.forEach( function ( obj ) {
				if ( obj.Point_type == "传感器" ) {
					if ( obj.Photo_angle == "0" ) {
						$( ".detail-0" ).append( '' +
							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
						);
					} else if ( obj.Photo_angle == "180" ) {
						$( ".detail-12" ).append( '' +
							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="传感器" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
						);
					}

				} else if ( obj.Point_type == "巡检点" ) {
					if ( obj.Photo_angle == "0" ) {
						$( ".detail-0" ).append( '' +
							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
						);
					} else if ( obj.Photo_angle == "180" ) {
						$( ".detail-12" ).append( '' +
							'<div class="state normal" style="top:' + ( obj.Y * height - 5 ) + 'px;left:' + ( obj.X * width - 5 ) + 'px;" id="' + obj.Id + '" point_type="巡检点" equipment_type="' + obj.Equipment_type + '" name="' + obj.Name + '" ></div>'
						);
					}
				};
			} );
		}
	} );
};
