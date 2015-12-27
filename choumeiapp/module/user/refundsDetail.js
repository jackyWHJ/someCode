/**
* @Author: zhanghuizhi
* @Date:2015-12-08 
*/
define(["jquery", "commonUtils"],
	function($, utils) {
    	var userId = '',
		    user = {},
		    ticketNo = '',
		    orderSn='',
		    item ='';
		 var $rliImg= $('#rliImg'),
		 	 $rliSalonName =$('#rliSalonName'),
		 	 $rliItemName =$('#rliItemName'),
		 	 $rliText3 =$('#rliText3'),
		 	 $refundStatus=$('#refundStatus'),
		 	 $cmNo =$('#cmNo'),
		 	 $refundsDetail=$('#refundsDetail');
		var init = function() {
			user = utils.checkLogin();
			if (user) {
				userId = user.userId;
			}
            utils.addMenu();
			ticketNo = utils.getQueryString("ticketNo");
			orderSn = utils.getQueryString("orderSn");
			//if(JSON.parse(window.sessionStorage.getItem("item")||window.localStorage.getItem("item"))){
				item =JSON.parse(window.localStorage.getItem("item"));
			//}
			//else{
			//	return;
			//}
			getRefundsDetailData();
		};
		var getRefundsDetailData = function() {
			if(ticketNo){
				//美发项目
				var data = {
					to: "refundInfo",
					type: "Fundflow",
					body: {
						"userId": userId,
						"ticketNo": ticketNo
					}
				};
				utils.ajaxRequest({
					data: data,
					successCallback: getCallBack.mFcallBack,
					url: apiConfig.orderApi
				});
			}
			else{
				//预约项目
				utils.request({
					data: {orderSn:orderSn},
					successCallback: getCallBack.mZcallBack,
					url: apiConfig.newApi+'order/refund-detail.html'
				});
			}
		};

		var getCallBack = {
			mFcallBack:function(data){
				//美发
				if (data.result==1) {
					var refundsRouteArr = [];
					var mainData = data.data.main,
						status = mainData.status,
						refundsMessage = mainData.message;
						$refundsDetail.attr('itemId',item.itemId);
						$rliImg.attr('src',item.imgUrl);
						$rliSalonName.text(item.salonName);
						$rliItemName.text(item.itemName);
						$rliText3.text('有效期：'+mainData.endTime);
						$('#cmNo').html('臭美券密码：'+'<i class="main-color">'+ticketNo.substring(0, 4) + ' ' + ticketNo.substring(4, 8)+'</i>');
						if (status == 6 || status == 8) {
							$refundStatus.text('退款中').addClass('main-color');
						} else if (status == 7) {
							$refundStatus.text('已退款');
						}
						$('#rdaMoney').text('￥' + mainData.priceAll);
						if (status == 6 || status == 7) {
							$('#rdaTitle').text(mainData.route);
						}
					getCallBack.renderRouteData(refundsMessage);
					addTicketDetailListener();
				}
				else{
					utils.showTip(data.msg);
				}
			},
			mZcallBack:function(data){
				if(data.code==0){
					var mainData = data.response,
						status = mainData.status,
						bookingSn = mainData.bookingSn,
						refundsMessage = mainData.message;
					$refundsDetail.attr('orderSn',item.orderSn);
					$rliImg.attr('src',item.imgUrl);
					$rliSalonName.text(item.salonName);
					$rliItemName.text(item.itemName);
					$rliText3.text('预约金￥'+mainData.priceAll);
					$('#cmNo').html('预约号：'+'<i class="main-color">'+bookingSn.substring(0,4)+' '+bookingSn.substring(4,8)+'</i>');
					if (status == '5' ) {
						$refundStatus.text('退款中').addClass('main-color');
					} else if (status == '6') {
						$refundStatus.text('已退款');
					}
					$('#rdaTitle').text(mainData.route);
					$('#rdaMoney').text('￥' + mainData.priceAll);
					getCallBack.renderRouteData(refundsMessage);
					addTicketDetailListener();
				}
				else{
					utils.showTip(data.message);
				}
			},
			renderRouteData:function(msgData){
				//退回流程
				var refundsMessage = msgData,
					refundsRouteArr=[];
				refundsRouteArr.push('<h3 class="rdf-title">退回流程:</h3>');
				var refundsFirstInfo = {title: "退回余额"};
				if (refundsMessage["one"]) {
					refundsFirstInfo = refundsMessage["one"];
				}
				var refundsSecondInfo = {title: "臭美处理完成"};
				if (refundsMessage["two"]) {refundsSecondInfo = refundsMessage["two"];}

				var refundsThirdInfo = {title: "退款成功"};
				if (refundsMessage["three"]) {refundsThirdInfo = refundsMessage["three"];}

				refundsRouteArr.push('<dl class="item-icon-left');
				if (!refundsFirstInfo.desc) {
					refundsRouteArr.push(' grey ');
				}
				var borderClass = refundsSecondInfo.desc ? "assertive" : "grey";

				refundsRouteArr.push('"><dt><span>' + refundsFirstInfo.title + '</span><i class="icon icon-circle icon-small bar-assertive">1</i></dt><dd class="border-'+borderClass+'">');
				if (refundsFirstInfo.desc) {
					refundsRouteArr.push('<p class="grey">' + refundsFirstInfo.desc + '</p>');
				}
				if (refundsFirstInfo.remark) {
					refundsRouteArr.push('<p class="grey">' + refundsFirstInfo.remark + '</p>');
				}
				refundsRouteArr.push('</dd></dl>');
				refundsRouteArr.push('<dl class="item-icon-left');
				if (!refundsSecondInfo.desc) {
					refundsRouteArr.push(' grey ');
				}
				var barClass = refundsSecondInfo.desc ? "assertive" : "grey";
				var borderClass = refundsThirdInfo.desc ? "assertive" : "grey";
				refundsRouteArr.push('"><dt><span');

				if (!refundsSecondInfo.desc) {
					refundsRouteArr.push(' class="grey" ');
				}
				refundsRouteArr.push('>' + refundsSecondInfo.title + '</span><i class="icon icon-circle icon-small bar-'+barClass+'">2</i></dt><dd class="border-'+borderClass+'">');
				if (refundsSecondInfo.desc) {
					refundsRouteArr.push('<p class="grey">' + refundsSecondInfo.desc + '</p>');
				}
				refundsRouteArr.push('</dd></dl>');
				refundsRouteArr.push('<dl class="item-icon-left');
				if (!refundsThirdInfo.desc) {
					refundsRouteArr.push(' grey ');
				}
				var barClass = refundsThirdInfo.desc ? "assertive" : "grey";
				refundsRouteArr.push('"><dt><span');

				if (!refundsThirdInfo.desc) {
					refundsRouteArr.push(' class="grey" ');
				}
				refundsRouteArr.push('>' + refundsThirdInfo.title + '</span><i class="icon icon-circle icon-small bar-'+barClass+'">3</i></dt><dd class="border-'+barClass+'">');
				if (refundsThirdInfo.desc) {
					refundsRouteArr.push('<p class="grey">' + refundsThirdInfo.desc + '</p>');
				}
				if (refundsThirdInfo.tips) {
					refundsRouteArr.push('<p class="grey main-color mt20">' + refundsThirdInfo.tips + '</p>');
				}
				refundsRouteArr.push('</dd></dl>');

				$(refundsRouteArr.join('')).appendTo($('#rdFlow'));
			}	
		};
		var addTicketDetailListener = function() {
			$refundsDetail.on('click', function() {
				var orderSn = $(this).attr('orderSn'),
					itemId =$(this).attr('itemId');
				if(itemId){
					window.location = "../home/itemDetail.html?itemId="+itemId;
				}else{
					window.location="../appoint/appoint-detail.html?beautySn="+orderSn;
				}
			});
		};
		return {
			'init': init
		}
    }
)
