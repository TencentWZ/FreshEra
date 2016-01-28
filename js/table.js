$(function() {
	// 加载页面公共部分
	me.util.layout();

	// 初始化表格
    $('#table_id').DataTable({
        "info": false,
        "jQueryUI": false,
        "ordering": false,
        "searching": false,
        "bLengthChange": false
    });
});
