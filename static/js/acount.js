/**
 * Created by jin on 17/3/26.
 */
$(function(){
    $('.user-edit').click(function(){
        rel = $(this).attr('rel');
        $(this).closest("#"+rel+"-span").hide();
        $('#'+rel+'-form').show();
    })
    $('.cancel').click(function(){
        rel = $(this).attr('rel');
        $("#"+rel+"-span").show();
        $('#'+rel+'-form').hide();
    })
});