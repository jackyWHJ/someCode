/**
 * Created by zhaoheng on 2015/7/20 10:19.
 * Last Modified by zhaoheng on 2015/7/20 10:19.
 */
 
define(["jquery", "commonUtils",'utils/module/tongdun'],
    function($, commonUtils,td) {
		var user="",userId="",pageNumber=0,pageSize=10;
   var init= function(){
	    commonUtils.addBack();
            commonUtils.addMenu();		
        user =  commonUtils.checkLogin();
		 
        if( user ){
			 userId = user.userId; 
           	        

            //this.listView();
            request();
            $(document).bind( "scroll",pageScrollListener );
            // $("#back").on("click",function(){
                // history.go(-1);
            // });
        }
      
    };  
    var listView=function(data){
        //var data = this.request(), html;
        var htmls;
        if( data.result == 1 ){
            if( data.data.main.length > 0 ){
                htmls = html( data.data.main );
                $(".voucher-con  ul").append( htmls );

            }else{
                $(document).unbind( "scroll", pageScrollListener );
                if(pageNumber == 1){//第一页数据都为空时显示
                    $(".voucher-con  .no-content").show();
                }
            }
        }else{
            commonUtils.alert(data.msg );
        }
    };
    var pageScrollListener=function( ev ){
        var nScrollHight = $(document).height(),
        nScrollTop = $(document).scrollTop(),
        nDivHight = $(window).height();

        if( nScrollTop + nDivHight >= nScrollHight){
            request();
        }

    };
    var request=function(){
        commonUtils.ajaxRequest({
            data: {
                to: "voucherList",
                type: "User",
                body: {
                    "userId":userId,
                    "page":pageNumber++,
                    "pageSize":pageSize
                }
            },
            successCallback:listView, 
            url: apiConfig.userApi
        })       
    };
    var html=function(data){
        var allHtml = '';
        $.each( data, function( index, value ){
            var statusClass = '', iconClass = '';
            if( value.vStatus == 1 ){
                statusClass = "not";
            }else if( value.vStatus == 2 ){
                statusClass = "ed";
                iconClass = 'voucher-ed';
            }else if( value.vStatus == 3 ){
                statusClass = "not";
            }else if( value.vStatus == 5 ){
                statusClass = "invalid";
                iconClass = 'voucher-invalid';
            }

            allHtml += '<li><div class="roll row ' + statusClass  + '"><div class="row-title"></div><div class="line"></div><div class="row-logo"></div><div class="column small-4"><span>&yen;</span><b>' + value.vUseMoney + '</b></div><div class="column small-8"><div class="title">' +  value.vcTitle+'</div><div class="content">' + value.limit +'</div><div class="time">' + value.vUseStart + " 至 " + value.vUseEnd +'</div></div><div class="' + iconClass  +'"></div></div></li>';

        });
        return allHtml;
    };
	return{
        'init':init
    };
});

