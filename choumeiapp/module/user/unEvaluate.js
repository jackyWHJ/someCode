define(["jquery", "commonUtils"],
    function($, utils) {
    	var userId='',
    		user={},
    		ticketNo='',
    		bookingSn='',
    		pageNum=1,
    		pageSize=20;
		var init = function(){
		    user = utils.checkLogin();
			if (user) {
				userId = user.userId;
			}
			utils.addBack();
            utils.addMenu();
		    unEvaluate.getData(); 
		    utils.goTop();  
		}
		var unEvaluate = {
			getData:function(){
		        utils.request({data:{
                    userId:userId,
                    pageNum:pageNum,
                    pageSize:pageSize
                },successCallback:unEvaluate.getCallBack,url:apiConfig.newApi+"user/un-evaluated-list.html"});
			},
			getCallBack:function(data){
				if(data.code==0){
					var mainData= data.response.items,
						mainDataLen = mainData.length,
						objListArr=[];
						if(mainDataLen==0&&pageNum==1){
							$('#noContentTips').show();
						}
					$.each(mainData,function(index,item){
						var status = item.status,
							orderSn = item.orderSn,
							itemId = item.itemId,
	                        salonId = item.salonId,
	                        ticketNo = item.ticketNo,
	                        orderTicketId=item.orderTicketId;
						objListArr.push('<div class="order-list">');
                    	objListArr.push('<p class="ol-header"><span class="text-overflow">'+item.salonName+'</span>');
    					objListArr.push('<em class="main-color">未评价</em>');
                    	objListArr.push('<div class="ol-info" itemId='+itemId+' salonId='+salonId+' orderTicketId='+orderTicketId+'>');         	
                    	objListArr.push('<img onerror="this.src=\'../../images/default_img.png\'" src="'+item.imgUrl +'" class="oli-img"/>');
                    	objListArr.push('<div class="oli-right"><p class="olir-text1 text-overflow">'+item.itemName+'');
                    	objListArr.push('</p><p class="olir-text2">臭美价<span class="main-color">￥'+item.money+'</span></p>');
                    	objListArr.push('<p class="olir-text3">购买时间：'+item.payTime+'</p></div>');
                    	objListArr.push('</div><p class="ol-bottom">');
                    	objListArr.push('<span class="olb-btn view-cmticket" ticketNo='+ticketNo+'>查看臭美券</span>');
                    	objListArr.push('<span class="olb-btn evaluate-btn" itemId='+itemId+' salonId='+salonId+' orderTicketId='+orderTicketId+'>评价</span>');
                    	objListArr.push('</p></div></div>');
					});
					$('#unEvaluateBox').append($(objListArr.join('')));
					if(mainDataLen >= pageSize && pageNum ==1){
                        $(document).bind("scroll",unEvaluate.addPageScrollListener);
                    }
					pageNum++;
					unEvaluate.addListener();
				}
			},
			addListener:function(){
				$('.evaluate-btn').off('click').on('click',function(){
                    var salonId =$(this).attr('salonId'),
                        itemId =$(this).attr('itemId'),
                        orderTicketId =$(this).attr('orderTicketId'),
                        itemName =$(this).parent().siblings('.ol-info').find('.olir-text1').text();
                    window.location='evaluateConsume.html?salonId='+salonId+'&itemId='+itemId+'&orderTicketId='+orderTicketId+'&itemName='+encodeURI(itemName);
                });
				$('.ol-info').off('click').on('click',function(){
					var itemId = $(this).attr('itemId');
					window.location = "../home/itemDetail.html?itemId="+itemId;
				});
				//查看臭美券
                $('.view-cmticket').off('click').on('click',function(){
                    var ticketNo =$(this).attr('ticketNo');
                    window.location = 'ticketDetail.html?ticketNo='+ticketNo;
                });
			},
			addPageScrollListener:function(){
				var nScrollHight = $(document).height();
		        var nScrollTop = $(document).scrollTop();
		        var nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         unEvaluate.getData();
			    }
			}
		}
		return {
			'init':init
		}
    }
   )
