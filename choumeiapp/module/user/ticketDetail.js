
define(["jquery", "commonUtils"],
    function($, commonUtils) {
	var userId='',user={};
	var addrLati='',addrLong='',ticketNo='',ticketStatus=2;
	var init = function(){
	    user =  commonUtils.checkLogin();
	    if(user){
	        userId = user.userId;
	    }
	    commonUtils.addBack();
        commonUtils.addMenu();
	    addrLati = commonUtils.getQueryString("addrLati")||addrLati|| window.localStorage.getItem("addrLati")||geoLoc.addrLati;
        addrLong = commonUtils.getQueryString("addrLong")||addrLong|| window.localStorage.getItem("addrLong")||geoLoc.addrLong;
        ticketNo = commonUtils.getQueryString("ticketNo");
	    //臭美券列表
	    getTicketDetailData();   
	};
	var getTicketDetailData = function(){
		var data = {to:"ticketInfo",type:"Fundflow",body:
			{
                "userId":userId,
                "ticketNo":ticketNo,
                "addrLati":addrLati,
                "addrLong":addrLong
            }
        };
        commonUtils.ajaxRequest(
            {data:data,successCallback:getTicketDetailCallBack,url:apiConfig.orderApi}
        );
	};
	var getTicketDetailCallBack = function(data){
		if(!data){return;}
		if(data.result){
			var ticketDetailData = data.data.main,
				itemInfoData = ticketDetailData.itemInfo,
				ticketInfoData = ticketDetailData.ticketInfo,
				salonInfoData = ticketDetailData.salonInfo,
				orderInfoData = ticketDetailData.orderInfo;
			//项目信息
			var iidImg = itemInfoData.logo;
			if(iidImg){
				$('.tdbi-img').attr('src',iidImg);
			}
			$('#itemName').text(itemInfoData.itemName);
			$('#priceDis').text('￥'+itemInfoData.price);
			$('#itemDetailInfo').attr('itemId',itemInfoData.itemId);
			var itemType= itemInfoData.itemType;
			if(itemType==2){
				$('#itemDetailInfo').addClass('special-price');
				var userLimit =itemInfoData.useLimit;
				if(userLimit!=''){
					$('#tdbiSpecialTips').show();
					$('#tdbiSpecialTips').text(itemInfoData.useLimit);
				}
			}
			else{
				$('#tbdiipOri').show();
				$('#priceOrigin').text('￥'+itemInfoData.priceOri);
			}
			$('#itemDetailInfo').on('click',function(){
				var itemId = $(this).attr('itemId');
				//跳转到项目详情
                if(itemType==2){
                    window.location = "../home/limitedTimeItemDetail.html?itemId=" + itemId;
                }
                else{
                    window.location = "../home/itemDetail.html?itemId=" + itemId;
                }
			});
			//臭美券信息
			var listExtraArr = ticketInfoData.listExtra;
			if(listExtraArr!=''){
				$('#tdbiodRules').text(ticketInfoData.listExtra);  //待定
			}
			else{
				$('#tdbiodRules').text('无规格');
			}
			$('#detailEndtime').text(ticketInfoData.limitTime);
	        ticketNo = ticketInfoData.ticketNo;
			$('#tdbiTicketNo').text(ticketNo.substring(0,4)+' '+ticketNo.substring(4,8));
			var ticketStatus = ticketInfoData.status+"";
			switch (String(ticketStatus)){
				case '2':
					$('#ticketStatus').text('未消费');
					$('#btnApplyRefunds').show();
					break;
				case '6':
					$('#ticketStatus').text('退款中');
					break;
				case '7':
					$('#ticketStatus').text('已退款');
					break;
			}
            if(ticketDetailData.canRefund != 1){
                $('#btnApplyRefunds').hide();
            }
			$('#btnApplyRefunds').on('click',function(){
				//var priceAll = ticketInfoData.priceAll;
				var priceAll =orderInfoData.payMoney;
				window.location="applyRefunds.html?ticketNo="+ticketNo+"&priceAll="+priceAll;
			});
			//店铺信息
			$('#tdbitSalonName').text(salonInfoData.salonName);
			$('.tdbit-img').text(salonInfoData.logo);
			$('#tdbiCommentNum').text(salonInfoData.commentNum);
			$('#tdbiSatisfyNum').text(salonInfoData.goodScale);
			$('#tdbiAddr').text(salonInfoData.addr);
			$('#tdbiDis').text(salonInfoData.dist);
			$('.tdbi-title').attr('salonId',salonInfoData.salonId);
			$('#btnViewStore').on('click',function(){
				var salonId  = $(this).parent().attr('salonId');
				window.location = "../salon/salonIndex.html?salonId=" + salonId;
			});
			//店铺导航
			$("#tdbiDistance,#tdbiAddr").on("click",function(){
	            var toAddrlati =salonInfoData.addrLati;
	            var toAddrlong =salonInfoData.addrLong;
	            var point = new BMap.Point(addrLong, addrLati);
	            var geoc = new BMap.Geocoder();
	            geoc.getLocation(point, function(rs){
	                var addComp = rs.addressComponents;
	               // window.location = "http://api.map.baidu.com/direction?origin=我的位置&destination=latlng:"+toAddrlati+","+toAddrlong+"|目标位置&mode=navigation&region="+addComp.city+"&output=html&src=臭美";
					window.location = "http://api.map.baidu.com/marker?location=" + toAddrlati + "," + toAddrlong + "&title=" + $("#tdbitSalonName").text() + "&content=" + $("#tdbiAddr").text() + "&output=html&src=臭美"
				});
        	});
		    //服务详情
		    $('#serviceDetail').text(ticketDetailData.note);
		    //订单信息
		    $('#orderNumber').text(orderInfoData.orderSn);
		    $('#payTime').text(orderInfoData.payTime);
		    $('#payMoney').text('￥'+orderInfoData.payMoney);
		    var couponsMoney = orderInfoData.useMoneyByVoucher;
		    if(couponsMoney!=''){
		    	$('#couponsMoney').text('￥'+couponsMoney);
		    }
		    else{
		    	$('#couponsMoney').text('￥0');
		    }
		}
	};

	return{
        'init':init
    };
});
