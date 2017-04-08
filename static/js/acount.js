/**
 * Created by jin on 17/3/26.
 */
$(function(){
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