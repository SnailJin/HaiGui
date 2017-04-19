load_next_page=true;
var nextPage=1
var pageSize=10;
var totalheight = 0;
var has_load=false;
var isClear=false;
(function($){
	$.fn.extend({
		insertAtCaret: function(myValue){
			var $t=$(this)[0];
			if (document.selection) {
				this.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
			}
			else
			if ($t.selectionStart || $t.selectionStart == '0') {
				var startPos = $t.selectionStart;
				var endPos = $t.selectionEnd;
				var scrollTop = $t.scrollTop;
				$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
				this.focus();
				$t.selectionStart = startPos + myValue.length;
				$t.selectionEnd = startPos + myValue.length;
				$t.scrollTop = scrollTop;
			}
			else {
				this.value += myValue;
				this.focus();
			}
		}
	})
})(jQuery);


function stop_load_next_page(){
	load_next_page=false;
};
function get_load_next_page(){
	return load_next_page
}
//滚动加载
//no_load不加载
//args={success:succsess,data:data,beforeSend:beforeSend,complete:complete，error:error}
function loadData(args)
{
	totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

	if (has_load||$(document).height() <= totalheight)
	{
		//加载数据
		if(nextPage==-1){
			return false;
		}
		if(load_next_page==true){
			args.beforeSend = function(){
				load_next_page=false;
			}
			args.complete = function(){
				load_next_page=true;
				has_load=false;
			}
			loadData(args);
		};
	}
}

