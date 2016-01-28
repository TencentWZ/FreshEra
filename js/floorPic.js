$( function () {
	$( '#floorTab a' ).click( function ( e ) {
		// Tab初始化
		e.preventDefault();
		$( this ).tab( 'show' );
	} );

	/* 3D开始 */
    var threeDinit = function () {
        var frames = SpriteSpin.sourceArray( 'css/images/{frame}.png', {
            frame: [ 1, 24 ],
            digits: 2
        } );
        // 要停留的图片
        var details = [ 0, 12 ];
        var detailIndex = 0;
        // 初始化
        var spin = $( '#spritespin' );
        spin.spritespin( {
            source: frames,
            width: 800,
            sense: -1,
            height: 600,
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
    }
    /* 3D结束 */


	/* 页面添加点开始 */
	function checkboxInit( checkboxArr ) {
		$( "#checkbox-equipment" ).html( '' );
		console.log( "AAA" );
		checkboxArr.forEach( function ( obj ) {
			$( "#checkbox-equipment" ).append( '<label><input class="checkbox-item" type="checkbox" point_type="equipment" value="' + obj + '" />' + obj + '</label>' );
		} );
		$( ".checkbox-item" ).on( "change", function () {
			var point_type = $( this ).attr( "point_type" );
			if ( point_type == "equipment" ) {
				$( ".checkbox-item[point_type='inspect']" ).prop( "checked", false );
			} else if ( point_type == "inspect" ) {
				$( ".checkbox-item[point_type='equipment']" ).prop( "checked", false );
			}
			$( ".state" ).hide();
			var all = document.getElementsByClassName( "checkbox-item" );
			for ( var i = 0; i < all.length; i++ ) {
				if ( all[ i ].checked === true ) {
					$( ".state[equipment_type='" + all[ i ].value + "']" ).show();
				}
			}
		} );
	}
	// 中间图部分
	$.ajax( {
		type: "GET",
		url: me.host( "floorMapBasic" ),
		dataType: "json",
		data: {},
		error: function ( res ) {
			alert( "floorName ajax error!" );
		},
		success: function ( res ) {
			checkboxInit( res.equipment_type );
			for ( var i in res.floor ) {
				$( "#floor-select" ).append( '<option value="' + i + '">' + res.floor[ i ] + '</option>' );
			}
			initFloor( $( "#floor-select" ).val() );
			$( "#floor-select" ).on( "change", function () {
				initFloor( $( "#floor-select" ).val() );
			} );
		}
	} );

    function initFloor(floor) {
        $.ajax({
            type: "GET",
            url: me.host("floorMapInit"),
            dataType: "json",
            data: {floor: floor},
            error: function(res) {
                alert("floorMapInit ajax error!");
            },
            success: function(res) {
                var width = parseFloat($(".map").css("width"));
                var height = parseFloat($(".map").css("height"));
                $(".map").css("background", "url(" + res.url + ") no-repeat");
                $(".map").html('');
                res.point.forEach(function(obj) {
                    if (obj.point_type == "equipment") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="equipment" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                    } else if (obj.point_type == "inspect") {
                        $(".map").append('' +
                            '<div class="state normal" style="top:' + (obj.y * height - 5) + 'px;left:' + (obj.x * width - 5) + 'px;" id="' + obj.id + '" point_type="inspect" equipment_type="' + obj.equipment_type + '" name="' + obj.name + '" ></div>'
                        );
                    };
                });
            }
        });
    };
} );