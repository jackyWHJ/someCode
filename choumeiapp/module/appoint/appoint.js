/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-12-04 10:26:21
 * @version $Id$
 */

define(['jquery','commonUtils'],function($,commonUtils){
    var beautyId,$datePage = $("#datePage"),$gender = $('.gender'),$referrerPage = $("#referrerPage"),$recommendedCodeWrap = $('#recommendedCodeWrap')
        ,recommentCode,inputCode,selectedItemId = commonUtils.getQueryString('itemId');
    var init = function(){
        if(commonUtils.checkLogin()){
            getItemListData();
            commonUtils.addBack("#appointPage .header");
            commonUtils.addMenu("#appointPage .header");
            $('#datePage .header .back,#referrerPage .header .back').on('click',function(){
                $(this).closest('.slide-page').removeClass('slideInRight').addClass('slideOutRight');;
            })
        }
    }

    var getItemListData  = function(){
        commonUtils.request({
            url:apiConfig.newApi+"booking/items.html",
            successCallback:renderItemList
        })
    }
    var renderItemList = function(data){
        if(data.code!=0){
            commonUtils.alert(data.message);
            return;
        }

        data = data.response;
        beautyId = data.beautyId;
        var tmpHtml = [],$container = $("#itemListContainer");

        $.each(data.groups,function(key,val){

            tmpHtml.push('<div class="appoint-itemListWrap" groupType = '+val.groupType+' ><div class="title"><h3>'+val.groupName+"</h3>");
            tmpHtml.push('<h4>韩国国家美容联合会XXXXXXXXX介绍</h4></div><ul class="appoint-itemList">');
            $.each(val.items,function(key,val){
                tmpHtml.push('<li itemId = '+val.itemId+' class='+ (selectedItemId==val.itemId?'selected':'')+'><span class="itemName">'+val.itemName+'</span><i class="selectIco"></i></li>');
            })
            tmpHtml.push("</ul></div>");
        })
        $container.html(tmpHtml.join(''));
        $container.find('.appoint-itemList').on('click','li',function(){
            $(this).toggleClass('selected');
        })

        data.recommendEnable == 'N' ? $recommendedCodeWrap.hide():$recommendedCodeWrap.show();
        getDateData();
    }

    $('#selectTime').on('click',function(){
        $datePage.show();
        $datePage.addClass('slideInRight').removeClass('slideOutRight');
    })

    var getDateData =  function(){
        commonUtils.request({
            data:{
                beautyId:beautyId
            },
            url:apiConfig.newApi+"booking/calendar.html",
            successCallback:renderDate
        })
    };
    var renderDate = function(data){
        if(data.code!=0){
            commonUtils.alert(data.message);
            return;
        }

        data = data.response;

        var tmpHtml = [],$calendar = $("#calendar");
        $.each(data,function(key,val){
            tmpHtml.push('<span class="dateWrap '+(val.isFull=='Y'?'full':'')+'" date='+val.bookingDate+'><div class="content"><span class="day">');
            tmpHtml.push(val.bookingWeek+'</span><span class="date">'+val.displayDate+"</span></div></span>");
        })
        $calendar.html(tmpHtml.join(''));
        $calendar.on('click','.dateWrap',function(){
            var that = $(this),$date = $("#appoint-date"),day = that.find('.day').text(),displayDate = that.find('.date').text(),date = that.attr("date");
            if(that.hasClass('full')){
                return;
            }
            $date.text(date+'('+day+')').attr('date',date);
            that.toggleClass('selected').siblings('').removeClass('selected');
            if($calendar.find('.selected').length != 0){
                $datePage.removeClass('slideInRight').addClass('slideOutRight');
            }
            
        })
    }


    $gender.on('click',function(){
        $gender.removeClass('selected');
        $(this).addClass('selected');
    })
    $recommendedCodeWrap.on('click',function(){
        $referrerPage.addClass('slideInRight').removeClass('slideOutRight').show();
    })

    $('#validateCode').on('click',function(){
        var type = 'SLN';
        inputCode = $('#inputCode').val();
        inputCode.match(/^1\d{10}$/)?type='PRS':'';
        commonUtils.request({
            data:{
                recommendedCode:inputCode,
                type:type
            },
            url:apiConfig.newApi+"recommended-code/submit.html",
            successCallback:function(data){
                if(data.code != 0){
                    commonUtils.alert(data.message)
                }else{
                    recommentCode = inputCode;
                    $("#recommendedCode").text(recommentCode);
                    $referrerPage.removeClass('slideInRight').addClass('slideOutRight');
                }
            }
        })
    })//end validateCode

    $('#submitAppoint').on('click',function(){
        var itemIds = [],$itemIds =$("#itemListContainer").find('.selected');
        $.each($itemIds,function(key,val){
            itemIds.push($(this).attr('itemId'));
        })
        if(itemIds.length ==0 ){
            commonUtils.alert('未选择项目');
            return;
        }

        var bookingDate = $('#appoint-date').attr('date');
        if(!bookingDate){
            commonUtils.alert('未选择日期');
            return;
        }

        var bookerName = $('#bookerName').val();
        if(!bookerName){
            commonUtils.alert('未填写姓名');
            return;
        }else if(commonUtils.strlen(bookerName) > 10){
            commonUtils.alert('用户名过长，长度要控制在10个字符以内');
            return;
        }

        commonUtils.request({
            data:{
                itemIds : itemIds,
                bookingDate : bookingDate,
                bookerName : bookerName,
                recommendedCode : recommentCode,
                bookerSex : $('.gender.selected').hasClass('female')?'F':'M',
                bookerPhone : ''
            },
            url:apiConfig.newApi + 'booking/place.html',
            successCallback:function(data){
                if(data.code != 0){
                    commonUtils.alert(data.message);
                }else{
                    sessionStorage.setItem('appoint-bill',JSON.stringify(data));
                    location = 'appoint-pay.html';
                }
                
            }
        })

    })
    return {
        init:init
    }
})

