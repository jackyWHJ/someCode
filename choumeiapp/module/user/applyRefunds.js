/**
* @Author: zhanghuizhi
* @Date:2015-12-08 
*/
define(["jquery", "commonUtils"],function($, utils) {
		var userId='',
			user={},
			priceAll='',
			ticketNo='',
			reType='',
			reReason='',
			itemType='',
			orderSn='',
			bookingSn='',
			money='',
			status='',
			$hairdressRefunds =$('#hairdressRefunds'),
			$reservationRefunds =$('#reservationRefunds');
		var init = function(){
			user =  utils.checkLogin();
		    if (user) {
				userId = user.userId;
			}
		    utils.addBack();
            utils.addMenu();
		    //美发
	        priceAll = utils.getQueryString("priceAll");
	        ticketNo = utils.getQueryString("ticketNo");
	        //预约
	        orderSn =utils.getQueryString('orderSn');
	        bookingSn =utils.getQueryString('bookingSn');
	        money = utils.getQueryString('money');
	        salonId =utils.getQueryString('salonId');
	        //判断美发或预约
	        itemType = utils.getQueryString('itemType');
	        if(itemType){
				//预约
				$hairdressRefunds.hide();
				$reservationRefunds.show();
				$('#reservationNo').text(bookingSn);
				$('#reservationAmount').text('￥'+money);
			}
			else{
				//美发
				$reservationRefunds.hide();
				$hairdressRefunds.show();
				$('#hairdressNo').text(ticketNo.substring(0,4)+' '+ticketNo.substring(4,8));
				$('#hairdressAmount').text('￥'+priceAll);
			}
			initSelectStyle();
			getRefundsData();
		}
		var getRefundsData = function(){
			$('#confirmRefunds').on("click",function(){
				reReason='';
				reType = $('#hairdressRefundsStyle').find('.select-current').index()+1;
				$('.refunds-reason>.arfa-text').each(function (index, obj) {
		        	var _dataStatus = $(obj).attr('data-status');
		        	if(_dataStatus=='current'){
		        		reReason+= index+',';
		        	}
		        });
		        reReason =reReason.substring(0,reReason.length-1);
		        var otherReason =$('#otherReason').val();
		       	if(reReason.length<1&&otherReason==''){
		       		utils.alert('请选择至少一项退款原因');
		       		return false;
		       	}
		       	if(itemType){
		       		//预约
		       		var data ={
		       			userId:userId,
		       			reReason:reReason,
		       			otherRereason:otherReason,
		       			bookingSn:bookingSn,
		       			orderSn:orderSn,
		       			salonId:salonId,
		       			itemType:itemType
		       		}
		       		console.log(data);
			        utils.request({data:data,successCallback:function(data){
			        	if(data.code==0){
			        		var mainData=data.response;
			        		window.sessionStorage.setItem("item",JSON.stringify(mainData));
	                		window.localStorage.setItem("item",JSON.stringify(mainData));
			        		utils.showTip('已收到你的退款申请');
			        		setTimeout(function(){
			        			window.location="refundsDetail.html?orderSn="+orderSn;
			        		},500);
			        	}else{
			        		utils.showTip(data.message);
			        	}
			        },url:apiConfig.newApi+'order/apply-booking-refund.html'});
			    }else{
			    	var data = {to:"ticketRefundDo",type:"Fundflow",body:
						{
			                "userId":userId,
			                "ticketNo":ticketNo,
			                "reType":reType,
			                "reReason":reReason
			            }
			        };
			        utils.ajaxRequest({data:data,successCallback:function(data){
			        	if(data.result){
			        		utils.showTip('申请退款成功，请耐心等待！');
			        		setTimeout(function(){
			        			window.location="myRefunds.html";
			        		},500);
			        	}else{
			        		utils.showTip(data.msg);
			        	}
			        },url:apiConfig.orderApi});
			    }
			});
		}
		var initSelectStyle = function(){
			$('#hairdressRefundsStyle>.arfa-text').on("click",function(){
		    	$(this).addClass('select-current').removeClass('select-normal').siblings().addClass('select-normal').removeClass('select-current');
		    	reType =$(this).index();
		    });
		    $('.refunds-reason .arfa-text').on('click',function(){
		    	var dataStatus = $(this).attr('data-status');
		    	if(dataStatus == "normal"){
		    		$(this).addClass('select-current').removeClass('select-normal');
		    		$(this).attr('data-status','current');
		    	}
		    	else{
		    		$(this).addClass('select-normal').removeClass('select-current');
		    		$(this).attr('data-status','normal');
		    	}
			});
		}
		return {
			'init':init
		}
	}
)
