function is_PC() {
    //ƽ̨���豸�Ͳ���ϵͳ
    var system = {
        win: false,
        mac: false,
        xll: false
    };
    //���ƽ̨
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    //��ת���
    if (system.win || system.mac || system.xll) {
        return true;
    } else {
        return false;
    }
}
//*****************Cookie******************************
jQuery.setCookie = function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
    var sCookie = sName + '=' + encodeURIComponent(sValue);
    if (oExpires) {
        sCookie += '; expires=' + oExpires.toGMTString();
    }
    ;
    if (sPath) {
        sCookie += '; path=' + sPath;
    }
    ;
    if (sDomain) {
        sCookie += '; domain=' + sDomain;
    }
    ;
    if (bSecure) {
        sCookie += '; secure';
    }
    ;
    document.cookie = sCookie;
};

jQuery.getCookie = function (sName) {
    var sRE = '(?:; )?' + sName + '=([^;]*)';
    var oRE = new RegExp(sRE);
    if (oRE.test(document.cookie)) {
        return decodeURIComponent(RegExp['$1']);
    } else {
        return null;
    }
    ;
}

jQuery.deleteCookie = function (sName, sPath, sDomain) {
    this.setCookie(sName, '', new Date(0), sPath, sDomain);
}

//*****************Cookie******************************
//form�?json
jQuery.prototype.serializeObject = function () {
    var obj = new Object();
    $.each(this.serializeArray(), function (index, param) {
        if (!(param.name in obj)) {
            obj[param.name] = param.value;
        }
    });
    return obj;
};

//��ȡurl����
function get_url_param(param) {
    var paramStr = window.location.search + '&';
    result = false;
    reString = param + '=(.*?)&'
    re = new RegExp(reString);
    r = paramStr.match(re)
    if (r != null) {
        result = r[1];
    }
    return result;
}

//ʱ���ʽ��
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

//倒计时
var countdown = 60;
function settime(context) {
    if (countdown == 0) {
        context.removeAttr("disabled"); //移除disabled属性
        context.text("发送验证码");
        countdown = 60;
    } else {
        context.attr('disabled',"true"); //添加disabled属性
        context.text("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function () {
        settime(context)
    }, 1000)
}




//ajax请求
//必填uccess:succsess,data:data,url:url
//args={success:succsess,data:data,url:url,type:type,beforeSend:beforeSend,complete:complete，error:error}
function loadData(args)
{
    type = 'POST';
    if(args.type != undefined){
        type = args.type;
    }
    $.ajax({
        type: type,
        url:args.url,
        data:args.data,
        beforeSend: function(XMLHttpRequest){
            loading(true);
            if(args.beforeSend != undefined){
                args.beforeSend();
            }
        },
        success: function(data, textStatus){
            if(args.success != undefined){
                args.success(data)
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            loading(false);
            if(args.complete != undefined){
                args.complete();
            }
        },
        error: function(response){
            if(args.error != undefined){
                args.error();
            }

            // alert('网络异常!')
        }
    });
}
//返回代码处理
function handleCode(code){
    if(code == 0){
        return true;
    }else{
        return false;
    }
}

//插入数据 feildDiv 插入位置div 列表 val插入数据
function insertVal(feildDivList,val){
    for(var i=0;i<feildDivList.length ; i++){
        feildDiv = feildDivList.eq(i);
        if(feildDiv.is('span') || feildDiv.is('p') || feildDiv.is('h4')){
            feildDiv.text(val);
        }else if(feildDiv.is('select')){
            feildDiv.val(val);
        }else if(feildDiv.is('input') || feildDiv.is('textarea') ){
            feildDiv.val(val);
        }
    }
}