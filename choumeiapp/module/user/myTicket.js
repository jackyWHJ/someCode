define(["jquery", "commonUtils"],function($, utils) {
		var userId='',
			user={},
			ticketNo='',
			status ='notuse',
			page=1,
			pageSize=20,
			nScrollHight = 0,
			nScrollTop=0,
			nDivHight=0;
		var init = function(){
			user =  utils.checkLogin();
		    if(user){
		        userId = user.userId;
		    }
		    utils.addBack();
            utils.addMenu();
		    //臭美券列表
		    getMyTicket.getTicketData(); 
		    utils.goTop();  
		}
		var getMyTicket = {
			getTicketData:function(){
				var data = {to:"ticketFlow",type:"Fundflow",body:
				{
	                "userId":userId,
	                "status":status,
	                "page":page,
	                "pageSize":pageSize
	            }
		        };
		        utils.ajaxRequest(
		            {data:data,successCallback:this.getTicketCallBack,url:apiConfig.orderApi}
		        );
			},
			getTicketCallBack:function(data){
				var that = this;
				if(data.result){
					var ticketData= data.data.main,
						ticketDataLen = ticketData.length,
					    TicketListArr=[],
					    totalNum = data.data.other.totalNum;
					if(totalNum==0&&page==1){
						$('#noTicketTips').show();
					}
					for(var i=0;i<ticketDataLen;i++){
						var isInvalid = ticketData[i].isInvalid,itemType=ticketData[i].itemType;
						if(isInvalid==2&&itemType==2){
							TicketListArr.push('<div class="mtb-listc overdue-ticket special-price" itemId='+ticketData[i].itemid+' ticketNo='+ticketData[i].ticketNo+'>');
						}
						else if(isInvalid==1&&itemType==2){
							TicketListArr.push('<div class="mtb-list special-price" itemId='+ticketData[i].itemid+' ticketNo='+ticketData[i].ticketNo+'>');
						}
						else if(isInvalid==2&&itemType==1){
							TicketListArr.push('<div class="mtb-list overdue-ticket" itemId='+ticketData[i].itemid+' ticketNo='+ticketData[i].ticketNo+'>');
						}
						else{
							TicketListArr.push('<div class="mtb-list" itemId='+ticketData[i].itemid+' ticketNo='+ticketData[i].ticketNo+'>');
						}
						TicketListArr.push('<div class="mtbl-info"><div class="mtbli-img sprite-img"></div>');
						TicketListArr.push('<div class="mtbli-text"><p class="mtblit-salon-name text-overflow">'+ticketData[i].salonName+'</p>');
						TicketListArr.push('<p class="mtblit-item-name">'+ticketData[i].itemName+'</p>');
						TicketListArr.push('<p class="mtblit-valid-time">有效期：'+ticketData[i].limitTime+'</p>');
						TicketListArr.push('</div></div>');
						TicketListArr.push('<p class="mtbl-bottom">');
						if(isInvalid==2){
							TicketListArr.push('<span class="mtbl-ticket-status">已过期</span>');
						}
						TicketListArr.push('<span class="mtbl-ticketno-text">臭美券密码');
						TicketListArr.push('<em class="ticket-no" id="mtbTicketNo">'+ticketData[i].ticketNo.substring(0,4)+' '+ticketData[i].ticketNo.substring(4,8)+'</em></span></p></div>');
					}
					$('#myTicketBox').append($(TicketListArr.join('')));
					
					if(totalNum>pageSize&&page ==1){
						var that = this;
		 				$(document).bind("scroll",getMyTicket.addPageScrollListener);
		 			}
		 			page ++;
		 			getMyTicket.addTicketListener();
				}
			},
			addTicketListener:function(){
				$('.mtb-list').on("click",function(){
		        	ticketNo = $(this).attr('ticketNo');
		        	window.location = "ticketDetail.html?ticketNo=" + ticketNo;
				});
			},
			addPageScrollListener:function(){
				nScrollHight = $(document).height();
		        nScrollTop = $(document).scrollTop();
		        nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         getMyTicket.getTicketData();
			    }
			}
		}
		return {
			'init':init
		}
	}
)
