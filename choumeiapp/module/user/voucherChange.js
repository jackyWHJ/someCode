/**
 * Created by liyueping on  .
 */
 
define(["jquery", "commonUtils"],
    function($, commonUtils) {
	var user="",userId="",page=1,pageSize=15,$vouchertit=$('#voucher-tit'),tit="";
    var init = function() {
        user =  commonUtils.checkLogin();
        if( user ){
			 userId = user.userId; 			 
        }
		$vouchertit.on('input',function(){
			tit=$vouchertit.val();
			if(tit!=null){				    
				 $("#voucherBtn").removeClass("changeBtn-enable");
				 $("#voucherDiv").removeClass("voucher-enable");				  			 
			}else{	
				$("#voucherBtn").off("click").addClass("changeBtn-enable");
				$("#voucherDiv").off("click").addClass("voucher");
			}
			//$("#voucherBtn").on("click");
		});
        commonUtils.addBack();
        commonUtils.addMenu();        
		addVoucher();
		addVoucherlist();		
    }; 
	//兑换监听
	var addVoucher=function(){
		$("#voucherBtn").on('click',function(){
			tit=$vouchertit.val(); 
			tit = tit.replace(/\s+/g, '')
			if(tit.length){
			    voucherClick();
			}
		});		
	};
	
	//兑换动作
	var voucherClick=function(){
		commonUtils.request({
            data: {               
                    "userId": userId,
                    "code":tit
            },
            successCallback: function(data){
				if(data.code==0){                        
                    commonUtils.showTip('兑换成功');
                    setTimeout(function(){
                        window.location.reload();
                    },1000);
                }else{
					  commonUtils.showTip(data.message);
				}
			}, 
            url: apiConfig.newApi+"voucher/redeem.html"
        })
	};
 //列表请求
	 var addVoucherlist=function(){
		 commonUtils.request({
            data: {             
                    "userId": userId,
                    "page": page,
                    "size":pageSize
            },
            successCallback: listVoucher, 
            url: apiConfig.newApi+"voucher/redeemed-list.html"
        });
	 }
	//列表显示
	var listVoucher =function(data){
        var html;
        if( data.code==0 ){
			var myVoucher = data.response;			
            if( myVoucher.length > 0){			 
                html = renderHtml( myVoucher );
                $(".voucher-big  ul").append( html );				
				 if($(".voucher-big").find('li').length>5 && page == 1 ){
                  $(document).bind( "scroll",pageScrollListener );
                    }
                page ++;
            }else{ 
				if(page==1){
					$(".voucher-big .no-content").show();
				}
            }
        }else{
            commonUtils.showTip(data.message);
        }
    }
	//滚动条显示
    var pageScrollListener= function( ){
        var nScrollHight = $(document).height(),
        nScrollTop = $(document).scrollTop(),
        nDivHight = $(window).height();
        if( nScrollTop + nDivHight >= nScrollHight){
            addVoucherlist();
        }
    }
	//页面渲染
    var renderHtml= function(data){
        var allHtml = '';
		//data = JSON.parse(data);
        // $.each( data, function( index, value ){ 		
			// allHtml+='<li><div class="row1 text-overflow"><span class="row-pas text-overflow">密码</span> <span class="row-get text-overflow">' +value.code+' </span> </div><div class="row2 text-overflow"> <span class="row-pas text-overflow ">现金券</span> <span class="row-get  text-overflow"> '+value.title+'</span></div></li>'
        // });
		 $.each( data, function( index, value ){ 		
			allHtml+='<li><div class="row2"><span class="row-get text-overflow">'+value.code+' </span><span class="row-pas text-overflow">'+value.title+'</span></div></li></div></li>'
		});
        return allHtml;		
    };
	return{
        'init':init
    };
});