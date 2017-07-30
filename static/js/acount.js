/**
 * Created by jin on 17/3/26.
 */
$(function(){
    init();
    //getStatement();

    $('.user-edit').click(function(){
        rel = $(this).attr('rel');
        span = $(this).closest("#"+rel+"-span");
        span.hide();
        form = $('#'+rel+'-form');
        parseForm(span,form)
        form.show();
    })
    $('.cancel').click(function(){
        rel = $(this).attr('rel');
        $("#"+rel+"-span").show();
        $('#'+rel+'-form').hide();
        return false;
    })
    $('.btn-cancel').click(cancel_info);
    $('.base_submit').click(function(){
        form = $(this).closest('form');
        className = form.attr('id').split('-form')[0]
        spanDiv = $('#'+className+'-span');
        paseSpan(spanDiv,form);
        form.hide();
        spanDiv.show();
        return false;
    })
    //添加按钮
    $('.add-btn').click(function(){
        rel = $(this).attr('rel');
        form = $('#'+rel+' #'+rel+'-form');
        form.show();
    })


});
//转成form
function parseForm(spanDiv,formDiv){
    spanDiv = span.find("span[class$='_span']");
    for(var i=0 ;i < spanDiv.length ; i++){
        content = spanDiv[i];
        className = content.className;
        val = $(content).text();
        formCLassName = className.split('_span')[0];
        feildForm =formDiv.find('.'+formCLassName);
        if(feildForm.is('select')){
            feildForm.val(val);
        }else if(feildForm.is('span')){
            feildForm.text(val);
        }else{
            feildForm.val(val);
        }
    }
}
//转成span
function paseSpan(spanDiv,formDiv){
    formFieldList = formDiv.find("input,select");
    for(var i=0 ;i < formFieldList.length ; i++){
        contentForm = formFieldList[i];
        className = contentForm.getAttribute("name");
        val = $(contentForm).val();
        feild =spanDiv.find('.'+className+'_span');
        feild.text(val)
    }
}
//获取简历列表
function getStatementList(){
    formData.body={pageNo:0,pageSize:100};
    formData.key="LoadPersonalStatementList";
    sccuess=function(data){
        if(handleCode(data.code)) {
            return data.body;
        }
    }
    loadData({url:url,data:formData,success:sccuess});
}
//获取简历
function getStatement(){
    statementList = getStatementList();
    if(statementList.total >0){
        statement = statement[0];
    }
}

/**填充信息
 *
 * @param data
 * @param field
 */
function parseInfo(data,field){
    for(var i in data){
        info = data[i];
        var infoDiv = $('#clone').find('.'+field+'-context').clone();
        var infoSpan = infoDiv.find("."+field+"-span");
        for(var key in info){
            infoSpan.attr(key,info[key]);
            insertAccountVal(infoDiv.find("."+key),info[key],field);
        }
        $('#'+field).append(infoDiv);
        addEvent(infoDiv,field);
    }
    var infoForm = $('#clone').find('.'+field+'-form').clone();
    infoForm.attr("id",field+"-form");
    infoForm.find('.delete_info').remove();
    infoForm.find('.adv-submit').click(advSumbit)
    $('#'+field).append(infoForm)

}
/**
 * 更新现有信息
 * @param data
 * @param field
 */
function updateInfo(data,field,infoDiv){
    for(var i in data){
        info = data[i];
        var infoSpan = infoDiv.find("."+field+"-span");
        for(var key in info){
            infoSpan.attr(key,info[key]);
            insertAccountVal(infoDiv.find("."+key),info[key],field);
        }
    }
}


//初始化字段
function init(){
    priceList = ["propose_salary","current_alarys"];
    for(var i= 0 ;i<priceList.length ;i++){
        for(j=10;j<100;j=j+10){
            value = j+"万-"+(j+10)+"万";
            $('#'+priceList[i]).append('<option value="'+value+'">'+value+'</option>');
        }
        $('#'+priceList[i]).append('<option value="100万以上">100万以上</option>');
    }


    //数据初始化
    parseInfo([{ schoolName:"浙江工业大学之江学院",fromDate:"2015-02",toDate:"2016-02", deploma:"本科",profession:"软件工程",gpa:"8.0",description:"浙江大学，简称浙大，坐落于素有“人间天堂”美誉的历史文化名城杭州。前身是1897年创建的求是书院，是中国人自己最早创办的现代高等学府之一"}],"education")
    //parseInfo([{title:"java开发1",companyName:"杭州拼爱网路有限公司1",companyBusinessType:"软件工程",companyCity:"杭州",companyFrom:"2015-04",companyEndTime:"2016-5",companyDuty:"负责公司的交友app么么哒后台的开发，维护，版本迭代，以及和ios，Android和产品之间的交互，根据主管要求进行任务分配。"}],'job-experience');
    //parseInfo([{projectName:'海归项目',projectTimeFrom:"2013-2",projectTimeTo:"2015-12",projectDescription:"主要负责架构设计分析"}],"project-experience");
    //parseInfo([{language:0,grade:3},{language:1,grade:2}],"language-ability");
    //parseInfo([{honourType:0,honourContent:"sfdsdfsdfsd"}],"other");

    //loadEnterpriseInformation();
}


//添加事件
function addEvent(div,key){
    //时间初始化
    div.find('.timeControl').datetimepicker({
        format:'Y-m',
        timepicker:false,
        maxDate:new Date(new Date().setFullYear(new Date().getFullYear()-16)),
        defaultDate:new Date(new Date().setFullYear(new Date().getFullYear()-18))
    });
    div.find('.delete_info').click(delete_info);
    div.find('.edit-div').click(function(){
        $(this).closest('.'+key+'-context').find('.'+key+'-form').show();
    })
    div.find('.btn-cancel').click(cancel_info);
    //提交处理
    div.find('.adv-submit').click(advSumbit);
}

//删除条目
function delete_info(){
    $(this).closest("."+$(this).attr('rel')+"-context").remove();
}
//取消
function cancel_info(){
    $(this).closest("form").hide();
    return false;
}


//插入数据 feildDiv 插入位置div 列表 val插入数据
function insertAccountVal(feildDivList,val,key){
    //对特殊的select处理
    var selectFlag = false;
    for(var i=0;i<feildDivList.length ; i++){
        feildDiv = feildDivList.eq(i);
        if(feildDiv.is('select')){
            selectFlag = true;
            feildDiv.val(val);
        }
    }

    for(var i=0;i<feildDivList.length ; i++){
        feildDiv = feildDivList.eq(i);
        if(feildDiv.is('span') || feildDiv.is('p') || feildDiv.is('h4')){
            if(selectFlag){
                text =feildDiv.closest('.'+key+"-context").find('form').find("."+feildDiv.attr('class')).find("option:selected").text();
                feildDiv.text(text);
            }else{
                feildDiv.text(val);
            }

        }else if(feildDiv.is('select')){
            feildDiv.val(val);
        }else if(feildDiv.is('input') || feildDiv.is('textarea') ){
            feildDiv.val(val);
        }
    }
}

//提交数据处理
function advSumbit(){
    context = $(this);
    rel = context.attr("rel")
    form = context.closest("."+rel+"-form");
    context = context.closest("."+rel+"-context");
    jsonList = [];
    json = form.serializeObject();
    jsonList.push(json)
    if(context == undefined||context.length==0){
        parseInfo(jsonList,rel)
        cleanContent(form)
    }else{
        updateInfo(jsonList,rel,context);
    }
    form.hide();
    return false;
}


//获取个人信息数据
function loadEnterpriseInformation(async){
    formData.key="LoadPersonalStatmenList";
    formData.body={pageNo:0,pageSize:20};
    success=function(data){
        data = JSON.parse(data);
    }
    opt={data:formData,async:false}
    ajaxLoad(opt)
}
/**
 * 清空内容
 * @param context
 */
function cleanContent(context){
    inputlist = context.find("input,textarea");
    for(var i in inputlist){
        inputlist.eq(i).val("");
    }
}