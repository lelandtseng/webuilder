$(function(){
		
$('#show-logindialog-button').click(function(){
    $.get('/login',function(data){
    $('#dialog').html(data);
    $('#dialog').dialog();                       
    });
});



				
$('#nav').draggable({containment:'#page' });

$("#dialog").dialog({ autoOpen: false ,model:true});

// show nav.
$.get('/nav',function(data){
    $("#nav").html(data);
});

// 显示logo
$("#logo").css("background-image","url(/logo?"+new Date().getTime()+")");
})
