/**
 * Created by liguang.jin on 2016/3/31.
 */
 //测试
var url="http://47.89.38.171/HGZGZ/interface";
    var noLoginList = ['/HaiGui/login.html','/HaiGui/register.html','/HaiGui/index.html',"/HaiGui/activate.html","/HaiGui/about.html"];
//正式
//var url = window.location.origin + "/HGZGZ/interface";
//var noLoginList = ['/login.html','/register.html','/index.html',"/","/activate.html","/about.html"];

var type =0;
var loginFlage =true; //登录失效标识
var page
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
    if(data.code==8 || data.code == 10  ){
        if(loginFlage){
            var body=$('<p>'+data.message+'</p>')
            $.poplayer({body:body,btnFunc:login});
            loginFlage = false;
        }
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

