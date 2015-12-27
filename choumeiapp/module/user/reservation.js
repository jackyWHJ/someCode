define(["jquery", "commonUtils"],
    function($, utils) {
    	var userId='',
    		user={},
    		pageNum =1,
			pageSize=20;
		var init = function(){
			user =  utils.checkLogin();
            if(user){
                userId = user.userId;
            }
		    utils.addBack();
            utils.addMenu();
		    reservation.getData();
		    utils.goTop();  
		}
		var reservation = {
			getData:function(){
				var data = {
	                userId:userId,
	                pageNum:pageNum,
	                pageSize:pageSize
		        };
		        utils.request({data:data,successCallback:this.getCallBack,url:apiConfig.newApi+'user/my-semipermanent.html'});
			},
			getCallBack:function(data){
				if(data.code==0){
					var data =data.response,
						itemData = data.items,
						itemLen = itemData.length,
						objArr=[];
					if(itemLen==0&&pageNum==1){
						$('#noContentTips').show();
					}
					$.each(itemData,function(index,item){
						objArr.push('<li><div class="rbl-content" orderSn="'+item.orderSn+'" bookingSn="'+item.bookingSn+'">');
						objArr.push('<img onerror="this.src=\'../../images/default_img.png\'" src="'+item.salonUrl+'" alt="">');
						objArr.push('<div class="rblc-right"><p class="rblcr-title text-overflow">'+item.itemName+'</p>');
						objArr.push('<p class="rblcr-text">预约金<span class="main-color">￥'+item.bookingMoney+'</span></p>');
						objArr.push('<p class="rblcr-text">预约时间:'+item.bookingTime+'</p></div>');
						objArr.push('</div> <p class="rbl-name">'+item.salonName+'</p></li>');
					});
					$('#reservationBox ul').append($(objArr.join('')));
					if(itemLen>=pageSize&&pageNum ==1){
		 				$(document).bind("scroll",reservation.addPageScrollListener);
		 			}
					pageNum++;
					reservation.addClickListener();
				}
			},
			addClickListener:function(){
				$('.rbl-content').off('click').on("click",function(){
		        	var orderSn = $(this).attr('orderSn');
		        	window.location = "../appoint/appoint-detail.html?beautySn=" + orderSn;
				});
			},
			addPageScrollListener:function(){
				var nScrollHight = $(document).height();
		        var nScrollTop = $(document).scrollTop();
		        var nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         reservation.getData();
			    }
			}
		}
		return {
			'init':init
		}
    }
   )
