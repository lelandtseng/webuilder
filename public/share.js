$(function(){
		
$('#show-logindialog-button').click(function(){
    $.get('/login',function(data){
    $('#dialog').html(data);
    $('#dialog').dialog();                       
    });
});

$('#toolbar').tabs({
	ajaxOptions:{}
});

$('.theme').click(function(o){
	$($('link')[0]).attr('href',$(this).attr('theme'));							
});

$('.layout').click(function(){

    var layout = $(this).attr('layout');
    var num = layout.split(':');	
    if(num.length==2){$('#right').hide();
    var bb = num[0]+'%';
    var bb2 = num[1]+'%'
    $('#left').css('width',bb);
    $('#centent').css('width',bb2);
    }
    else{
    var bb = num[0]+'%'
    var bb2 = num[1]+'%'
    var bb3 = num[2]+'%'
    $('#left').css('width',bb);
    $('#centent').css('width',bb2);
    $('#right').show();
    $('#right').css('width',bb3);
    }

    $('#left,#centent,#right').sortable({
    connectWith: ".connectedSortable"
    }).disableSelection();
    
});
				
$('#nav').draggable({containment:'#page' });

function savestate(){
    var theme = $($('link')[0]).attr('href');
    var leftcss = $('#left').attr('style');	
    var cententcss = $('#centent').attr('style');	
    var rightcss = $('#right').attr('style');
    var headerlength = $('#header').css('height');
    var logosize = $('#logo').css('height');
    var navtop = $('#nav').css('top');
    var navleft = $('#nav').css('left');
    $.post("/savestate",{
        theme:theme,
        leftcss:leftcss,
        cententcss:cententcss,
        rightcss:rightcss,
        headerlength:headerlength,
        logosize:logosize,
        navtop:navtop,
        navleft:navleft
        },function(data){
        alert(data);
    }); 
}

$('#show-toolbar-button').click(function(){
    savestate();
});

$("#dialog").dialog({ autoOpen: false ,model:true});

// show nav.
$.get('/nav',function(data){
    $("#nav").html(data);
});

// 显示logo
$("#logo").css("background-image","url(/logo?"+new Date().getTime()+")");
})
