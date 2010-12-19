			$(function(){
			
				
				$('#show-logindialog-button').click(function(){
					$('#login-dialog').dialog();
				});


				$('#show-regdialog-button').click(function(){
					$('#reg-dialog').dialog();
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
				$('#left,#centent,#right').sortable({
					connectWith: ".connectedSortable"
				}).disableSelection();
				$('#nav').draggable({containment:'#page' });


			})
