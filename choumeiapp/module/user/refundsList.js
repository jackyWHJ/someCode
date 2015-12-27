define(["jquery", "commonUtils"],
    function($, utils) {
    	var userId='',
    		user={},
    		ticketNo='',
    		bookingSn='',
    		cache={},
    		item={};
		var init = function(){
		    user = utils.checkLogin();
			if (user) {
				userId = user.userId;
			}
			utils.addBack();
            utils.addMenu();
		    refundsList.getData(); 
		    utils.goTop();  
		}
		var refundsList = {
			getData:function(){
		        utils.request({data:{
		        	userId:userId
		        },successCallback:refundsList.getCallBack,url:apiConfig.newApi+'order/refund-list.html'});
			},
			getCallBack:function(data){
				if(data.code==0){
					var mainData= data.response.items,
						mainDataLen = mainData.length,
						objListArr=[];
						if(mainDataLen==0){
							$('#noContentTips').show();
						}
					$.each(mainData,function(index,item){
						var status = item.status,
							orderSn = item.orderSn,
							ticketNo = item.ticketNo;
						var rangeKey =Math.random();
						var dataKey = rangeKey++;
						objListArr.push('<div class="order-list">');
                    	objListArr.push('<p class="ol-header"><span class="text-overflow">'+item.salonName+'</span>');
                    	if(status=='5'){
                    		objListArr.push('<em class="main-color">退款中</em>');
                    	}
                    	else{
                    		objListArr.push('<em>已退款</em>');
                    	}
                    	if(ticketNo){
                    		//美发
                    		objListArr.push('</p><div class="ol-info" itemId ='+item.itemId +' ticketNo='+item.ticketNo+'>');
                    	}
                    	else{
                    		objListArr.push('</p><div class="ol-info" orderSn ='+orderSn +' status='+status+'>');
                    	}          	
                    	objListArr.push('<img onerror="this.src=\'../../images/default_img.png\'" src="'+item.imgUrl +'" class="oli-img"/>');
                    	objListArr.push('<div class="oli-right"><p class="olir-text1 text-overflow">'+item.itemName+'');
                    	objListArr.push('</p><p class="olir-text2">'+((ticketNo)?'臭美价':'预约金')+'<span class="main-color">￥'+item.money+'</span></p>');
                    	objListArr.push('<p class="olir-text3">购买时间：'+item.payTime+'</p></div>');
                    	objListArr.push('</div><p class="ol-bottom">');
                    	if(ticketNo){
                    		objListArr.push('<span class="olb-btn" ticketNo='+ticketNo+' dataKey='+dataKey+' >退款详情</span>');
                    	}
                    	else{
                    		objListArr.push('<span class="olb-btn" orderSn ='+orderSn+' dataKey='+dataKey+' status='+status+'>退款详情</span>');
                    	}
                    	
                    	objListArr.push('</p></div></div>');
                     	cache[dataKey] = item;
					});
					
					$('#myRefundsBox').append($(objListArr.join('')));
					refundsList.addListener();
				}
			},
			addListener:function(){
				$('.olb-btn').off('click').on("click",function(){
					item= cache[$(this).attr('dataKey')];
					window.sessionStorage.setItem("item",JSON.stringify(item));
	                window.localStorage.setItem("item",JSON.stringify(item));
	                var ticketNo = $(this).attr('ticketNo'),
	                	orderSn =$(this).attr('orderSn'),
	                	status = $(this).attr('status');
		        	if(ticketNo){
		        		window.location = "refundsDetail.html?ticketNo=" + ticketNo;
		        	}
		        	else{
		        		if(status=='8'){
		        			//线下退款
		        			window.location = "../appoint/appoint-detail.html?beautySn="+orderSn
		        		}
		        		else{
		        			//非线下退款
		        			window.location = 'refundsDetail.html?orderSn='+ orderSn;
		        		}
		        	}
				});
				//详情跳转,定妆类都跳转到预约单详情
				$('.ol-info').off('click').on('click',function(){
					var itemId = $(this).attr('itemId'),
						ticketNo = $(this).attr('ticketNo'),
					    orderSn = $(this).attr('orderSn'),
					    bookingSn =$(this).attr('bookingSn'),
					    status = $(this).attr('status');
					if(ticketNo){
						window.location = "../home/itemDetail.html?itemId="+itemId;
					}else{
		        		window.location = "../appoint/appoint-detail.html?beautySn="+orderSn
					}
				});
			},
			addPageScrollListener:function(){
				var nScrollHight = $(document).height();
		        var nScrollTop = $(document).scrollTop();
		        var nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         unUse.getUnUseData();
			    }
			}
		}
		return {
			'init':init
		}
    }
   )
