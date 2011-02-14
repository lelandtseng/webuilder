			$(function(){
		
			    $('#show-logindialog-button').click(function(){
                    $.get('/login',function(data){
                    
                       $('#dialog').html(data);
                       $('#dialog').dialog();                       
                    });
					
				});

				$('#toolbar').tabs({
					ajaxOptions:{
						
					}
				})

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
                    // 色调
                    var theme = $($('link')[0]).attr('href');
                    // 布局
                    var leftcss = $('#left').attr('style');	
                    var cententcss = $('#centent').attr('style');	
                    var rightcss = $('#right').attr('style');
                    // 标题栏高度
                    var headerlength = $('#header').css('height');
                    //logo 高度
                    var logosize = $('#logo').css('height');
                    // 导航栏top
                    var navtop = $('#nav').css('top');
                    var navleft = $('#nav').css('left');
                    // 保存模块
                  //  var leftmodelnames = null;
                  //  var centermodelnames = null;
                  //  var rightmodelnames = null;                   
                    
                  $.post("/savestate",
                    {
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
                 

			})
