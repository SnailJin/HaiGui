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
    $('.submit').click(function(){
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
        form = $('#'+rel+'-form');
        if(!form.is(':hidden')){
            return;
        }
        form.find('input').html('');
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

    //时间初始化
    $('#company_start_time,#company_end_time').datetimepicker({
        format:'Y-m',
        timepicker:false,
        maxDate:new Date(new Date().setFullYear(new Date().getFullYear()-16)),
        defaultDate:new Date(new Date().setFullYear(new Date().getFullYear()-18)),
    });
}