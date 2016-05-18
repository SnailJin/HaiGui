function is_PC(){
	//平台、设备和操作系统
	var system ={
	win : false,
	mac : false,
	xll : false
	};
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	//跳转语句
	if(system.win||system.mac||system.xll){
	return true;
	}else{
		return false;
	}
}
//*****************Cookie******************************
jQuery.setCookie = function (sName, sValue, oExpires, sPath, sDomain, bSecure) {  
    var sCookie = sName + '=' + encodeURIComponent(sValue);  
    if (oExpires) {  
        sCookie += '; expires=' + oExpires.toGMTString();  
    };  
    if (sPath) {  
        sCookie += '; path=' + sPath;  
    };  
    if (sDomain) {  
        sCookie += '; domain=' + sDomain;  
    };  
    if (bSecure) {  
        sCookie += '; secure';  
    };  
    document.cookie = sCookie;  
};  
  
jQuery.getCookie = function (sName) {  
    var sRE = '(?:; )?' + sName + '=([^;]*)';  
    var oRE = new RegExp(sRE);  
    if (oRE.test(document.cookie)) {  
        return decodeURIComponent(RegExp['$1']);  
    } else {  
        return null;  
    };  
}  
  
jQuery.deleteCookie = function (sName, sPath, sDomain) {  
    this.setCookie(sName, '', new Date(0), sPath, sDomain);  
}  

//*****************Cookie******************************
//form表单json
jQuery.prototype.serializeObject=function(){
	var obj=new Object();
	$.each(this.serializeArray(),function(index,param){
		if(!(param.name in obj)){
			obj[param.name]=param.value;
		}
	});
	return obj;
};

//获取url参数
function get_url_param(param){
	var paramStr=window.location.search+'&';
	result=false;
	reString=param+'=(.*?)&'
	 re =new RegExp(reString);
	 r=paramStr.match(re)
	 if(r!=null){
		 result=r[1];
	 }
	return result;
}

//时间格式化
Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
	format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
	if(new RegExp("("+ k +")").test(format)) { 
	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
	} 
	} 
	return format; 
	} 