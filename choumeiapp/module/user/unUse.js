/**
* @Author: zhanghuizhi
* @Date:2015-12-08 
*/
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
		    unUse.getData(); 
		    utils.goTop();  
		}
		var unUse = {
			getData:function(){
		        utils.request({data:{
                    userId:userId,
                    pageNum:pageNum,
                    pageSize:pageSize
                },successCallback:unUse.getCallBack,url:apiConfig.newApi+"user/unfinished-order-list.html"});
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
	                        ticketNo= item.ticketNo,
	                        articleCodeId = item.articleCodeId,
	                        isGift = item.isGift,
	                        type= item.type,
	                        str='',
	                        orderTicketId=item.orderTicketId;
						objListArr.push('<div class="order-list">');
                    	objListArr.push('<p class="ol-header"><span class="text-overflow">'+item.salonName+'</span>');
    					objListArr.push('<em class="main-color">未消费</em>');
                        if(type=='MF'){
                            objListArr.push('<div class="ol-info" itemId='+itemId+'>');  
                        }else{
                            if(articleCodeId){
                                objListArr.push('<div class="ol-info" articleCodeId='+articleCodeId+'>');  
                            }
                            else{
                                objListArr.push('<div class="ol-info" orderSn='+orderSn+'>');  
                            }   
                        }      	
                    	objListArr.push('<img onerror="this.src=\'../../images/default_img.png\'" src="'+item.imgUrl +'" class="oli-img"/>');
                        objListArr.push('<div class="oli-right">');
                    	if(articleCodeId){
                            if(isGift=='Y'){
                                objListArr.push('<div class="olir-top"><p class="olir-text1 text-overflow">'+item.itemName+'</p><i class="gift-tips">赠送</i></div>');
                            }
                        }
                        else{
                            objListArr.push('<p class="olir-text1 text-overflow">'+item.itemName+'</p>');
                        }

                        if(type='MF'){
                           str='臭美价';
                        }
                        else{
                            str='预约金';
                            if(articleCodeId){
                                if(isGift=='Y'){
                                   str='会员疗程价';
                                }
                            }
                        }
                    	objListArr.push('<p class="olir-text2">'+str+'<span class="main-color">￥'+item.money+'</span></p>');
                    	objListArr.push('<p class="olir-text3">购买时间：'+item.payTime+'</p></div>');
                    	objListArr.push('</div><p class="ol-bottom">');
                    	if(orderTicketId){
                    		objListArr.push('<span class="olb-btn view-cmticket" ticketNo='+ticketNo+'>查看臭美券</span>');
                    	}else{
                            if(articleCodeId){
                                //赠送单
                                objListArr.push('<span class="olb-btn view-booking-btn"  articleCodeId='+articleCodeId+'>查看预约单</span>');
                            }
                            else{
                                //非赠送单
                                objListArr.push('<span class="olb-btn view-booking-btn" orderSn='+orderSn+'>查看预约单</span>');
                            }
                    	}
                    	if(articleCodeId){
                            if(isGift=='Y'){
                                objListArr.push('<span class="ol-valid text-overflow">有效期 '+item.giftStartTime+'至 '+item.giftEndTime+'</span>');
                            }
                        }
                    	objListArr.push('</p></div></div>');
					});
					$('#unUseBox').append($(objListArr.join('')));
					if(mainDataLen >= pageSize && pageNum ==1){
                        $(document).bind("scroll",unUse.addPageScrollListener);
                    }
					pageNum++;
					unUse.addListener();
				}
			},
			addListener:function(){
				//查看臭美券
                $('.view-cmticket').off('click').on('click',function(){
                    var ticketNo =$(this).attr('ticketNo');
                    window.location = 'ticketDetail.html?ticketNo='+ticketNo;
                });
                //查看预约单
                $('.view-booking-btn').off('click').on('click',function(){
                    var orderSn = $(this).attr('orderSn'),
                        articleCodeId = $(this).attr('articleCodeId');
                    if(articleCodeId){
                        //赠送
                        window.location ='../appoint/appoint-detail.html?articleCodeId='+articleCodeId;
                    }
                    else{
                        window.location ='../appoint/appoint-detail.html?beautySn='+orderSn;
                    }
                });
                //详情页
                $('.ol-info').off('click').on('click',function(){
                    var itemId = $(this).attr('itemId'),
                        orderSn =$(this).attr('orderSn'),
                        articleCodeId = $(this).attr('articleCodeId');
                    if(itemId){
                        window.location ="../home/itemDetail.html?itemId="+itemId;
                    }else{
                        //跳转到预约单详情页
                        if(articleCodeId){
                            window.location ='../appoint/appoint-detail.html?articleCodeId='+articleCodeId; 
                        }else{
                            window.location ='../appoint/appoint-detail.html?beautySn='+orderSn;
                        }  
                    }
                });
			},
			addPageScrollListener:function(){
				var nScrollHight = $(document).height();
		        var nScrollTop = $(document).scrollTop();
		        var nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         unUse.getData();
			    }
			}
		}
		return {
			'init':init
		}
    }
   )
