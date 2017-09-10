/**
 * Created by jin on 17/3/26.
 */
jsonbody = {
    basicInfomation:{},
    propose:{},
    workHistory:[],
    educationHistory:[],
    languageSkill:[],
    projectHistory:[],
    additional:{}
}
var psId = null; //简历id
$(function () {
    init();
    $('.user-edit').click(function () {
        rel = $(this).attr('rel');
        span = $(this).closest("#" + rel + "-span");
        span.hide();
        form = $('#' + rel + '-form');
        parseForm(span, form)
        form.show();
    })
    $('.cancel').click(function () {
        rel = $(this).attr('rel');
        $("#" + rel + "-span").show();
        $('#' + rel + '-form').hide();
        return false;
    })
    $('.btn-cancel').click(cancel_info);
    //基本信息和求职提交
    $('.base-submit').click(function () {
        form = $(this).closest('form');
        className = form.attr('id').split('-form')[0]
        spanDiv = $('#' + className + '-span');
        paseSpan(spanDiv, form);
        form.hide();
        spanDiv.show();
        var data = form.serializeObject();
        if(className == 'user-info'){
            jsonbody["basicInfomation"]=data;
        }else if(className == 'job-hope'){
            jsonbody["propose"]=data;
        }
        addAndModifyStatement(true);
        return false;
    })

    //添加按钮
    $('.add-btn').click(function () {
        rel = $(this).attr('rel');
        form = $('#' + rel + ' #' + rel + '-form');
        //是新增
        form.attr("type", "new");
        form.show();
    })


});
//转成form
function parseForm(spanDiv, formDiv) {
    spanDiv = span.find("span[class$='_span']");
    for (var i = 0; i < spanDiv.length; i++) {
        content = spanDiv[i];
        className = content.className;
        val = $(content).text();
        formCLassName = className.split('_span')[0];
        feildForm = formDiv.find('.' + formCLassName);
        if (feildForm.is('select')) {
            feildForm.val(val);
        } else if (feildForm.is('span')) {
            feildForm.text(val);
        } else {
            feildForm.val(val);
        }
    }
}
//转成span
function paseSpan(spanDiv, formDiv) {
    formFieldObject = formDiv.serializeObjectSpan();
    for (var i in formFieldObject) {
        contentForm = formFieldObject[i];
        feild = spanDiv.find('.' + i + '_span');
        feild.text(contentForm)
    }
}


//list提交数据处理
function newSubmit() {
    //form = $(this).closest('form');
    //className = form.attr('rel').split('-form')[0]
    //context = form.closest("." + className + "-context")
    //spanDiv = context.find('.' + className + '-span');
    //paseSpan(spanDiv, form);
    //form.hide();
    //return false;
    rel = $(this).attr("rel")
    form = $(this).closest('form');;
    context = $(this).closest("." + rel + "-context");
    spanDiv = $(this).closest("." + rel + "-context")
    if (context == undefined || context.length == 0) {
        jsonList = [];
        json = form.serializeObject();
        jsonList.push(json)
        parseInfo(jsonList, rel)
        cleanContent(form)
    } else {
        paseSpan(spanDiv, form);
    }
    form.hide();
    return false;
}

/**填充信息
 *
 * @param data
 * @param field
 */
function parseInfo(data, field) {
    for (var i in data) {
        info = data[i];
        var infoDiv = $('#clone').find('.' + field + '-context').clone();
        var infoSpan = infoDiv.find("." + field + "-span");
        for (var key in info) {
            infoSpan.attr(key, info[key]);
            insertAccountVal(infoDiv.find("." + key + ",." + key + "_span"), info[key], field);
        }
        $('#' + field).append(infoDiv);
        infoDiv.find('.new-submit').click(newSubmit);
        addEvent(infoDiv, field);
    }



}
/**
 * 更新现有信息
 * @param data
 * @param field
 */
//function updateInfo(data, field, infoDiv) {
//    for (var i in data) {
//        info = data[i];
//        var infoSpan = infoDiv.find("." + field + "-span");
//        for (var key in info) {
//            infoSpan.attr(key, info[key]);
//            insertAccountVal(infoDiv.find("." + key), info[key], field);
//        }
//    }
//}


//初始化字段
function init() {
    priceList = ["proposeSalary"];
    for (var i = 0; i < priceList.length; i++) {
        for (j = 10; j < 100; j = j + 10) {
            value = j + "万-" + (j + 10) + "万";
            $('#' + priceList[i]).append('<option value="' + j+"-"+(j+10) + '">' + value + '</option>');
        }
        $('#' + priceList[i]).append('<option value="100万以上">100万以上</option>');
    }
    priceList = [ "currentSalary"];
    for (var i = 0; i < priceList.length; i++) {
        for (j = 10; j < 100; j = j + 1) {
            value = j +  "万";
            $('#' + priceList[i]).append('<option value="' + j + '">' + value + '</option>');
        }
        $('#' + priceList[i]).append('<option value="100万以上">100万以上</option>');
    }

    getStatementList(true);

    //数据初始化
    //parseInfo([{
    //    schoolName: "浙江工业大学之江学院",
    //    fromDate: "2015-02",
    //    toDate: "2016-02",
    //    deploma: "本科",
    //    profession: "软件工程",
    //    gpa: "8.0",
    //    description: "浙江大学，简称浙大，坐落于素有“人间天堂”美誉的历史文化名城杭州。前身是1897年创建的求是书院，是中国人自己最早创办的现代高等学府之一"
    //}], "education")
    parseInfo([{title:"java开发1",companyName:"杭州拼爱网路有限公司1",companyBusinessType:0,companyCity:"杭州",companyFrom:"2015-04",companyEndTime:"2016-5",companyDuty:"负责公司的交友app么么哒后台的开发，维护，版本迭代，以及和ios，Android和产品之间的交互，根据主管要求进行任务分配。"}],'job-experience');
    parseInfo([],"project-experience")
    //parseInfo([{projectName:'海归项目',projectTimeFrom:"2013-2",projectTimeTo:"2015-12",projectDescription:"主要负责架构设计分析",projectPosition:"java开发工程师"}],"project-experience");
    //parseInfo([{language: 0, grade: 3}, {language: 1, grade: 2}], "language-ability");
    //parseInfo([{honourType:0,honourContent:"sfdsdfsdfsd"}],"other")
    initAddForm(["education","job-experience","project-experience","language-ability","other"])
    // loadEnterpriseInformation();

}

//讲所有的添加form初始化完成
function initAddForm(keyList) {
    for ( i in keyList) {
        field = keyList[i]
        var infoForm = $('#clone').find('.' + field + '-form').clone();
        infoForm.attr("id", field + "-form");
        infoForm.find('.delete_info').remove();
        infoForm.find('.new-submit').click(newSubmit);
        $('#' + field).append(infoForm)
    }
}



//添加事件
function addEvent(div, key) {
    //时间初始化
    div.find('.timeControl').datetimepicker({
        format: 'Y-m',
        timepicker: false,
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
        defaultDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    });
    div.find('.delete_info').click(delete_info);
    div.find('.edit-div').click(function () {
        $(this).closest('.' + key + '-context').find('.' + key + '-form').show();
    })
    div.find('.btn-cancel').click(cancel_info);
}

//删除条目
function delete_info() {
    $(this).closest("." + $(this).attr('rel') + "-context").remove();
}
//取消
function cancel_info() {
    $(this).closest("form").hide();
    return false;
}


//插入数据 feildDiv 插入位置div 列表 val插入数据
function insertAccountVal(feildDivList, val, key) {
    //对特殊的select处理
    var selectFlag = false;
    var selectClass;
    for (var i = 0; i < feildDivList.length; i++) {
        feildDiv = feildDivList.eq(i);
        if (feildDiv.is('select')) {
            selectFlag = true;
            selectClass = feildDiv.attr('name')
            feildDiv.val(val);
        }
    }

    for (var i = 0; i < feildDivList.length; i++) {
        feildDiv = feildDivList.eq(i);
        if (feildDiv.is('span') || feildDiv.is('p') || feildDiv.is('h4') || feildDiv.is('div')) {
            if (selectFlag) {
                text = feildDiv.closest('.' + key + "-context").find('form').find("." + selectClass).find("option:selected").text();
                feildDiv.text(text);
            } else {
                feildDiv.text(val);
            }

        } else if (feildDiv.is('select')) {
            feildDiv.val(val);
        } else if (feildDiv.is('input') || feildDiv.is('textarea')) {
            feildDiv.val(val);
        }
    }
}




//获取简历列表
function getStatementList(async) {
    formData.key = "LoadPersonalStatementList";
    formData.body = {pageNo: 0, pageSize: 20};
    success = function (data) {
        data = JSON.parse(data);
        if (handleCode(data.code)) {
            body = data.body;
            if (body.total > 0) {
                psId = body.list[0].id
                console.log(body.list[0].id);
            }
        }
    }
    opt = {data: formData, async: false,success:success}
    ajaxLoad(opt)
}

//添加或修改简历列表
function addAndModifyStatement(async) {

    if (psId == null) {
        formData.key = "AddPersonalStatement";
    } else {
        formData.body.id=psId;
        formData.key = "ModifyPersonalStatement";
    }
    formData.body.title = "中文简历";
    formData.body.realName = "金李广"
    formData.body.body = jsonbody;
    success = function (data) {
        data = JSON.parse(data);
        if (handleCode(data.code)) {
            psId = data.body.id
        } else {
            alert(data.message)
        }
    }
    opt = {data: formData, async: false,success:success}
    ajaxLoad(opt)
}

/**
 * 清空内容
 * @param context
 */
function cleanContent(context) {
    inputlist = context.find("input,textarea");
    for (var i in inputlist) {
        inputlist.eq(i).val("");
    }
}