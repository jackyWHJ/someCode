define(["jquery", "commonUtils"],
    function($, utils) {
    	var userId='',user={},ticketNo='';
		var status ='refund',page=1,pageSize=20;
		var nScrollHight = 0,nScrollTop=0,nDivHight=0;
		var init = function(){
			user =  JSON.parse(window.sessionStorage.getItem("user")||window.localStorage.getItem("user"));
		    if(user){
		        userId = user.userId;
		    }
		    else{
		        utils.alert("你还没登录！请先登录！");
		        window.sessionStorage.setItem("location",window.location);
		        window.location = "userLogin.html";
		    }
		    //退款券列表
		    getMyRefunds.getRefundsData(); 
		    utils.goTop();  
		}
		var getMyRefunds = {
			getRefundsData:function(){
				var data = {to:"ticketFlow",type:"Fundflow",body:{
	                "userId":userId,
	                "status":status,
	                "page":page,
	                "pageSize":pageSize
	            	}
		        };
		        utils.ajaxRequest({data:data,successCallback:this.getRefundsCallBack,url:apiConfig.orderApi});
			},
			getRefundsCallBack:function(data){
				if(data.result){
					var refundsData= data.data.main;
					var refundsListArr=[];
					var totalNum = data.data.other.totalNum;
					if(totalNum==0&&page==1){
						$('#noRefundsTips').show();
					}
					for(var i=0;i<refundsData.length;i++){
						var refundsStatus = refundsData[i].status,itemType=refundsData[i].itemType;
					    if(refundsStatus==7&&itemType==2){
							refundsListArr.push('<div class="mtb-list special-price overdue-ticket" itemId='+refundsData[i].itemid+' ticketNo='+refundsData[i].ticketNo+'>');
						}
						else if(refundsStatus==6&&itemType==2){
							refundsListArr.push('<div class="mtb-list special-price" itemId='+refundsData[i].itemid+' ticketNo='+refundsData[i].ticketNo+'>');
						}
						else if(refundsStatus==7&&itemType==1){
							refundsListArr.push('<div class="mtb-list overdue-ticket" itemId='+refundsData[i].itemid+' ticketNo='+refundsData[i].ticketNo+'>');
						}
						else{
							refundsListArr.push('<div class="mtb-list" itemId='+refundsData[i].itemid+' ticketNo='+refundsData[i].ticketNo+'>');
						}
						refundsListArr.push('<div class="mtbl-info"><div class="mtbli-img sprite-img"></div>');
						refundsListArr.push('<div class="mtbli-text"><p class="mtblit-salon-name text-overflow">'+refundsData[i].salonName+'</p>');
						refundsListArr.push('<p class="mtblit-item-name">'+refundsData[i].itemName+'</p>');
						refundsListArr.push('<p class="mtblit-valid-time">有效期：'+refundsData[i].limitTime+'</p>');
						refundsListArr.push('</div></div>');
						refundsListArr.push('<p class="mtbl-bottom">');
						if(refundsStatus==6){
							refundsListArr.push('<span class="mtbl-ticket-status">退款中</span>');
						}else if(refundsStatus==7){
							refundsListArr.push('<span class="mtbl-ticket-status">已退款</span>');
						}
						refundsListArr.push('<span class="mtbl-ticketno-text">臭美券密码');
						refundsListArr.push('<em class="ticket-no" id="mtbTicketNo">'+refundsData[i].ticketNo.substring(0,4)+' '+refundsData[i].ticketNo.substring(4,8)+'</em></span></p></div>');
					}
					$('#myRefundsBox').append($(refundsListArr.join('')));
					
					if(totalNum>pageSize&&page ==1){
						var that = this;
		 				$(document).bind("scroll",getMyRefunds.addPageScrollListener);
		 			}
		 			page ++;
		 			getMyRefunds.addRefundsListener();
				}
			},
			addRefundsListener:function(){
				$('.mtb-list').on("click",function(){
		        	ticketNo = $(this).attr('ticketNo');
		        	window.location = "refundsDetail.html?ticketNo=" + ticketNo;
				});
			},
			addPageScrollListener:function(){
				nScrollHight = $(document).height();
		        nScrollTop = $(document).scrollTop();
		        nDivHight = $(window).height();
			    if(nScrollTop + nDivHight >= nScrollHight){
			         getMyRefunds.getRefundsData();
			    }
			}
		}
		return {
			'init':init
		}
    }
   )
