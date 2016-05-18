/**
 * Created by liguang.jin on 2016/3/31.
 */
var url="http://47.89.38.171/HGZGZ/interface";
var origin  = "http://localhost:63342";
var noLoginList = ['/HaiGui/login.html','/HaiGui/register.html'];
var type =0;
var user={
    "username":null,
    "userId":null,
    "email":null,
    "enterpriseNo":null
}
var formData = {
    "body":{},
    "code":0,
    "key":"",
    "message":"",
    "time":new Date().getTime(),
    "token":"",
    "uuid":""}

$(function(){
    init_html();
    bing_event();
    isLogin();
    //注销
    ;
});
//登录
function isLogin(){
    var pathname = window.location.pathname;
    for(var i in noLoginList){
        if(pathname == noLoginList[i]){
            return;
        }
    }
    //获取cookie
    formData.token= $.getCookie("token");
    if(formData.token==undefined || formData.token.length==0){
        login();
    }
}
function login(){
    window.location="login.html";
}
//初始化页面
function init_html(){
    if(type==1){
        $("#header").load("company_nav.html");
    }else{
        $("#header").load("nav.html");
    }
    $("#footer").load("footer.html");
}
//验证邮件
function verify_email(email){
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
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
    var user =$.getCookie('user');
    if(user != undefined){
        var user = JSON.parse(user);
        if(user == null){
        }else{
            return user;
        }

    }
    return null;
}
//插入个人信息
function set_user_info_html(){
    user = get_user_info();
    var userContent =$('.user-content');
    userContent.find("#username").html(user.username);
    userContent.find("#email").html(user.email);
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
    if(data.code==8 || data.code == 10){
        var body=$('<p>'+data.message+'</p>')
        $.poplayer({body:body,btnFunc:login});
    }else{
        var body=$('<p>'+data.message+'</p>')
        $.poplayer({body:body});
    }

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