/**
 * Created by liguang.jin on 2016/3/31.
 */
 //测试
//var url="http://127.0.0.1:8080/interface";
var url="http://101.37.76.155/HGZGZ/interface";
    var noLoginList = ['/HaiGui/login.html','/HaiGui/register.html','/HaiGui/index.html',"/HaiGui/activate.html","/HaiGui/about.html","/HaiGui/reset_password.html","/HaiGui/user_protocol.html"];
//正式
//var url = window.location.origin + "/HGZGZ/interface";
//var noLoginList = ['/login.html','/registerster.html','/index.html',"/","/activate.html","/about.html","/reset_password.html","/user_protocol.html"];
var token = 'haiguihiring_token';
var userCookie ="haiguihiring_user";
var type =0;
var loginFlage =true; //登录失效标识
var page;
//初始化信息
var initInoFlag = true;
var userToken={
    "username":null,
    "userId":null,
    "email":null,
    "enterpriseNo":null,
    loginTimestamp : null,
    loginStatus:false
}
var formData = {
    "body":{},
    "code":0,
    "key":"",
    "message":"",
    "time":new Date().getTime(),
    "token":$.getCookie(token),
    "uuid":""}

$(function(){
    init_html();
    bing_event();
    isLogin();
});
//半小时判断一下登录状态
function loginStatus(){
    var user =getUserCookie();
    if(!user || user.loginTimestamp == undefined){
        return false;
    }
    if((user.loginTimestamp - (new Date().getTime()))<=1000*60*30 && user.loginStatus){
        return true;
    }
    var flag = get_user_info();
    if(flag){
        var user = getUserCookie();
        if(user && user.loginTimestamp){
            return true;
        }
    }
    return false;
}

//更改页面登录登出状态
function loginStatusToHtml(){
    var flag = loginStatus();
    if(flag){
        $('#login').attr("id","logout").text('退出');
    }
}
//登录
function isLogin(){
    var pathname = window.location.pathname;
    //获取cookie
    formData.token= $.getCookie(token);
    for(var i in noLoginList){
        if(pathname == noLoginList[i]){
            return;
        }
    }
    if(formData.token==undefined || formData.token.length==0){
        var body=$('<p>请先登录再操作!</p>');
        $.poplayer({body:body,btnFunc:login});
        loginFlage = false;
        initInoFlag = false;
    }
}
function login(){
    window.location="login.html";
}
// 获取user cookie
function getUserCookie(){
    var user = $.getCookie(userCookie);
    if(user != undefined){
        var user = JSON.parse(user);
        if(user.email == null){
            return false;
        }else{
            return user;
        }
    }else{
        return false;
    }
}
//初始化页面
function init_html(){
    user = get_user_info();
    if(type==1){
        $("#header").load("company_nav.html");
    }else{
        if(user != undefined && user != null & user.enterpriseId != undefined){
            type = 1;
            $("#header").load("company_nav.html");
        }else{
            $("#header").load("nav.html");
        }

    }
    $("#footer").load("footer.html");
}
//验证邮件
function verify_email(email){
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!myreg.test(email)){
        return false;
    }else{
        return true;
    }
}

//显示错误信息
function show_errror(context,flag,content){
    var name = context.attr("name");
    var error = context.closest("div").find("."+name+"_error");
    if(!flag){
        error.parent().hide();
    }else{
        error.html(content);
        error.parent().show();

    }

}

//获取用户信息
function get_user_info(){
    var flag =true;
    var user =$.getCookie(userCookie);
    if(user != undefined){
        var user = JSON.parse(user);
        if(user.username == null){
            flag = false;
        }else{
            return user;
        }
    }
    if(!flag){
        if(window.location.pathname.indexOf("company_")!= -1){
            formData.key="LoadEnterpriseInformation";
        }else{
            formData.key="LoadEmployeeInformation";
        }

        formData.body={};
        $.ajax({
            type: 'post',
            url:url,
            async:false,
            data:JSON.stringify(formData),
            beforeSend: function(XMLHttpRequest){
            },
            success: function(data, textStatus){
                data = JSON.parse(data);
                if(data.code == 0){
                    user ={}
                    user.email=data.body.userName;
                    user.userId=data.body.userId;
                    user.username=data.body.name;
                    $.setCookie(userCookie,JSON.stringify(user));
                    return user;
                }else{
                    return_error(data);
                }
            },
            complete: function(XMLHttpRequest, textStatus){
            },
            error: function(response){
                alert('网络异常!')
            }
    })

    }

}
//插入个人信息
function set_user_info_html(){
    user = get_user_info();
    var userContent =$('.user-content');
    if(user == null ){
        return;
    }
    if(user.username != undefined){
        userContent.find("#username").html(user.username);
    }
    if(user.email != undefined){
        userContent.find("#email").html(user.email);
    }
}

//绑定事件
function bing_event(){
    $(".company-info").bind("click",function(){
        window.location.href="company_acount.html";
    });
    $(".change-password").bind("click",function(){
        window.location.href="change_password.html";
    });
}

//返回错误处理
function return_error(data){
    if(data.code==8 || data.code == 10 ){
        if(loginFlage){
            var body=$('<p>'+data.message+'</p>')
            $.poplayer({body:body,btnFunc:login});
            loginFlage = false;
        }
        return true;
    }else if(data.code == 65556 || data.code == 65552){
        var body=$('<p>'+data.message+'! <br>如未收到激活邮件或者激活邮件已经过期，请点击<a id = "resetEmail" href="javascript:void(0)">重新发送</a></p>')
    }else{
        var body=$('<p>'+data.message+'</p>')
    }
    body.find("#resetEmail").click(function(){
        if(typeof(email) == "undefined" || email == undefined){
            user = get_user_info();
            email = user.email;
        }
        SendActiveUserEmail(email);
    });
    $.poplayer({body:body});

}

//loginout
function logout(){
    formData.key="Logout";
    formData.body={};
    $.ajax({
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                clearCookie();
                var body=$('<p>'+'已退出登录!'+'</p>')
                btnFunc=login;
                $.poplayer({body:body,btnFunc:btnFunc});
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    });
}
//清除token
function clearCookie(){
    $.deleteCookie(token);
    $.deleteCookie(userCookie);
}
//添加删除收藏  0添加，1删除
function collect(){
    if(isCollect == 1){
        formData.key="RemoveFavouriteOccupation";
    }else{
        formData.key="AddFavouriteOccupation";
    }

    formData.body.occupationId=parseInt($('[name="occupationId"]').val().trim());
    $.ajax({
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                if(isCollect==0){
                    $(".glyphicon-star-empty").removeClass("glyphicon-star-empty").addClass("glyphicon-star");
                }else{
                    $(".glyphicon-star").removeClass("glyphicon-star").addClass("glyphicon-star-empty");
                }
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    });
}

//导航栏选中
function nav_select(){
    var titleList = $(".nav-title a");
    titleList.each(function(n,v){
        if(window.location.pathname.indexOf($(v).attr("href")) != -1 ){
            $(v).parent().addClass("select");
        }
    })
}

/**
 * 获取地址信息
 * context:this
 *sync 是否同步
 */
function get_area(context,sync){
    formData.key = "LoadSubGroupList";
    formData.body={"type":"location","pageNo":1, "pageSize":1000};
    var name = context.name;
    value = $(context).find("option:selected").attr("id");
    var parentId;
    var selectDiv;
    if(name == "nation"){
        if(value == undefined){
            selectDiv=$(context);
            parentId = null;
        }else{
            selectDiv = $(context).closest(".form-group").find("[name='province']");
            parentId = value;
        }
    }else if(name == "province"){
        selectDiv = $(context).closest(".form-group").find("[name='city']")
        parentId = value;
    }else{
        return false;
    }
    formData.body.parentId =parentId;

    var ajaxData ={
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                load_area_and_category(data.body.list,selectDiv);
                if(value == undefined){
                    get_area(context,true);
                }
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    };
    if(sync){
        ajaxData.async=false;
    }
    $.ajax(ajaxData);
}
/**
 * 加载地区和岗位类型
 * @param context
 */
function load_area_and_category(data,context){
    optionHtml ="";
    for(var i = 0;i<data.length;i++){
        var area = data[i]
        optionHtml = optionHtml + '<option value ="'+area.name+'" id="'+area.groupId+'">'+area.name+'</option>'
    }
    context.html(optionHtml);
}

/*
获取岗位类型
 */
function get_occupation_category(context,sync){
    formData.key = "LoadSubGroupList";
    formData.body={"type":"occupation","pageNo":1, "pageSize":1000};
    var name = context.name;
    value = $(context).find("option:selected").attr("id");
    var parentId;
    var selectDiv;
    if(name == "category1"){
        if(value == undefined){
            selectDiv=$(context);
            parentId = null;
        }else{
            selectDiv = $(context).closest(".form-group").find("[name='category2']");
            parentId = value;
        }
    }else{
        return false;
    }
    formData.body.parentId =parentId;

    var ajaxData ={
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                load_area_and_category(data.body.list,selectDiv);
                if(value == undefined){
                    get_occupation_category(context,true);
                }
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    };
    if(sync){
        ajaxData.async=false;
    }
    $.ajax(ajaxData);
}
//初始化地区如果地区没有被初始化
function init_area_if_none(){
    var nation = $("[name='nation']");
    var province = $("[name='province']");
    if(nation.find("option:selected").attr("value") ==undefined){
        get_area(nation[0],true);
    }
}

//初始化职位如果职位没有被初始化
function init_occupation_category_if_none(){
    var category = $("[name='category1']");
    if(category.find("option:selected").attr("value") ==undefined){
        get_occupation_category(category[0],true);
    }
}

//发送激活验证邮件
function SendActiveUserEmail(email){
    formData.key="SendActiveUserVerifyCode";
    formData.body={"userName":email};
    $.ajax({
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                var body=$('<p>'+'激活邮件已经发送至你的邮箱，请注意查收!</br><span style="font-size: 10px">(注：如长时间未收到邮件请查看垃圾邮箱)</span>'+'</p>')
                $.poplayer({body:body});
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    });
}

//发送验证邮件
function sendVerifyCode(email,context){
    formData.key="SendVerifyCode";
    formData.body={"userName":email};
    $.ajax({
        type: 'post',
        url:url,
        data:JSON.stringify(formData),
        beforeSend: function(XMLHttpRequest){
        },
        success: function(data, textStatus){
            data = JSON.parse(data);
            if(data.code == 0){
                var body=$('<p>'+'邮件已经发送至你的邮箱，请注意查收!'+'</p>')
                $.poplayer({body:body});
                if(context != undefined){
                    settime(context);
                }
            }else{
                return_error(data);
            }
        },
        complete: function(XMLHttpRequest, textStatus){
        },
        error: function(response){
            alert('网络异常!')
        }
    });
}

//ajax 封装
//opt={url:url,data:data,success}
//function ajaxLoad(opt){
//    $.ajax({
//        type: opt.type || 'post',
//        url:url,
//        async:opt.async || true,
//        data:JSON.stringify(opt.data),
//        beforeSend: function(XMLHttpRequest){
//            if(opt.beforeSend != undefined){
//                opt.beforeSend();
//            }
//        },
//        success: function(data, textStatus){
//            if(opt.success != undefined){
//                opt.success(data);
//            }
//        },
//        complete: function(XMLHttpRequest, textStatus){
//            if(opt.complete != undefined){
//                opt.complete();
//            }
//        },
//        error: function(response){
//            if(opt.error != undefined){
//                opt.error();
//            }
//        }
//    });
//}