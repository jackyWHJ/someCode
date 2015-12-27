define(["jquery", "commonUtils",'utils/module/tongdun'],
    function($, utils,td) {
        var user = {},
            userId = '',
            recommendedCode = '',
            codeNoLen = 0,
            maxlength = 6,
            $promocodeText = $('#activatePromocodeText'),
            $btnActivate = $('#btnActivate'),
            $errorTips = $('#errorTips'),
            $btnJump = $('#btnJump');
        var init = function() {
            user = utils.checkLogin();
            if (user) {
                userId = user.userId;
            }
            utils.addBack();
            utils.addMenu();
            activePromocode();
        };

        var activePromocode = function() {
            myPromocode.addActivateBtnListener();
            $btnJump.on("click", function() {
                myPromocode.pageBack();
            });
        },
        myPromocode = {
            getMyPromocodeData: function(data) {
                var data = {userId:userId,recommendedCode:recommendedCode};
                utils.request({
                    data:data,
                    successCallback:myPromocode.getCallback,
                    url:apiConfig.newApi+"recommended-code/query.html"
                });
            },
            getCallback: function(data) {
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
                                        setTimeout(function(){
                                            myPromocode.pageBack();
                                        },1000);
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
                } else {
                    utils.showTip(data.message);
                }
            },
            addActivateBtnListener: function() {
                $btnActivate.on('click', function() {
                    if (!$(this).hasClass('activate-status')){
                        return;
                    }
                    recommendedCode = $promocodeText.val().replace(/\s+/g, '');
                    if (recommendedCode) {
                        myPromocode.getMyPromocodeData();
                        tongdun({url:"user/invite-code/consume.html",data:{"authCode":recommendedCode}});
                        
                    } else {
                        $errorTips.show().text('请输入有效邀请码');
                    }
                });
            },
            pageBack: function() {
                var location = window.sessionStorage.getItem("location");
                //返回登录之前页面
                if (location) {
                    if (location.indexOf("userId=") > 0) {
                        location += user.userId;
                    }
                    window.location = location;
                } else {
                    window.location = '../salon/salonList.html';
                }
            }
        };
        return {
            'init': init
        }
    }
);

