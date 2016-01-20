// core: me
; (function(window, $) {
    window.me = {};
})(window, window.jQuery || window.Zepto);

// host
; (function(me, $) {
	var env = "mock"; // 测试环境与正式环境切换开关
	var host = function(name) {
        var url = {
            mock: {
                demoTest: './mock/demoTest.json',
                floorMapInit: './mock/floorMapInit.json'
            },
            pro: {
                demoTest: 'http://xxx.xxx.xxx/xxxxx',
                floorMapInit: 'http://xxx.xxx.xxx/xxxxx'
            }
        };
        return url[env][name] || null;
    };
    me.host = host;
})(me, window.jQuery || window.Zepto);

// layout
; (function(me, $) {
    var Layout = function() {};
    Layout.prototype.header = function() {
        
    };
    Layout.prototype.menu = function() {
        this.menuToggle("parent_01");
        this.menuToggle("parent_02");
    };
    Layout.prototype.menuToggle = function(id, callback) {
        $("#" + id).on("click", function() {
            if ($("." + id).css("display") == "block") {
                $("." + id).hide();
            } else {
                $("." + id).show();
            };
            if (callback) {
                callback();
            };
        });
    };
    me.layout = new Layout();
})(me, window.jQuery || window.Zepto);

// util
; (function(me, $) {
    var Util = function() {};
    Util.prototype.layout = function() {
        $("#header").load("layout/header.html", {}, function() {
            me.layout.header();
        });
        $("#menu").load("layout/menu.html", {}, function() {
            me.layout.menu();
        });
        $("#footer").load("layout/footer.html");
    };
    me.util = new Util();
})(me, window.jQuery || window.Zepto);
