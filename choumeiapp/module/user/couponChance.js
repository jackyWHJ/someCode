define(["jquery", "commonUtils",'utils/module/tongdun'],
    function($, utils,td) {
        var user = {},
            userId = '',
            recommendedCode='',
            $btnActivate = $('#btnActivate'),
            $activatePromocodeText=$('#activatePromocodeText'),
            $pbtciPromocode = $('#pbtciPromocode');
        var init = function() {
            user = utils.checkLogin();
            if (user) {
                userId = user.userId;
            }
            utils.addBack();
            utils.addMenu();
            couponChance.getPromocodeData();
            
            $('#pbTabTitle li').on('click',function(){
                var index = $(this).index();
                $('.pb-tab-content').find('.pbtc-item').eq(index).removeClass('dn').siblings().addClass('dn');
                $(this).addClass('pbtt-on').siblings().removeClass('pbtt-on');
                if(index==1){
                    $btnActivate.on('click',function(){
                        recommendedCode= $activatePromocodeText.val();
                        recommendedCode = recommendedCode.replace(/\s+/g, '');
                        if(recommendedCode!=''){
                            couponChance.getActivateData();
                            tongdun({url:"user/invite-code/consume.html",data:{"authCode":recommendedCode}});
                        }else{
                            utils.showTip('邀请码不能为空！');
                        }
                    }); 
                }else{
                   couponChance.getPromocodeData();
                }
             });
        }
        var couponChance ={
            getPromocodeData:function(){
                utils.request({
                    data:{userId:userId},
                    successCallback:function(data){
                        if(data.code==0){
                            var promoCode = data.response.recommendedCode;
                                promoCode = promoCode.substring(0,3)+'&nbsp;&nbsp;'+promoCode.substring(3,7)+'&nbsp;&nbsp;'+promoCode.substring(7,11);
                            $pbtciPromocode.html(promoCode);
                        }
                    },
                    url:apiConfig.newApi+"user/my-recommended-code.html"
                });
            },
            getActivateData:function(){
                var data = {userId:userId,recommendedCode:recommendedCode};
                utils.request({
                    data:data,
                    successCallback:couponChance.getActivateCallBack,
                    url:apiConfig.newApi+"recommended-code/query.html"
                });
            },
            getActivateCallBack:function(data){
                if(data.code==0){
                    var mainData= data.response,
                        type = mainData.type,
                        msgText = mainData.message;
                    utils.confirm(msgText, {okButtonText: "确认激活"}, function(isOk) {
                        if(isOk){
                           utils.request({
                                data:{userId:userId,type:type,recommendedCode:recommendedCode},
                                successCallback:function(data){
                                    if(data.code==0){
                                        utils.showTip('激活成功');
                                    }
                                    else{
                                       utils.showTip(data.message); 
                                    }
                                },
                                url:apiConfig.newApi+"recommended-code/submit.html"
                           });
                        }
                        else{
                            return;
                        }
                    });
                }else{
                    utils.showTip(data.message);
                }
            }
        }
        return {
            'init': init
        }
    }
);

