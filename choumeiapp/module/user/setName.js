define(["jquery", "commonUtils"],
    function($, commonUtils) {
        var user = {},userId = "",$nickNameInput = $('#nickNameInput'),$changeNameBtn=$('#changeNameBtn'),$cleanBtn=$('#cleanBtn');
        var init = function(){
            user =  commonUtils.checkLogin();
            if(user){
                userId = user.userId;
            }
            commonUtils.addBack();
            commonUtils.addMenu();
            $nickNameInput.on("input",function(){
                nickName = $nickNameInput.val();
                if(nickName.length >0){
                    $changeNameBtn.addClass('activate-status');
                    $cleanBtn.show();
                }
            });
            $cleanBtn.on('click',function(){
                $nickNameInput.val('');
                $cleanBtn.hide();
            });
            addSetNameListener();
        }
        
        /**
         * 添加设置昵称监听
         * */
        var addSetNameListener = function(){
            $changeNameBtn.on("click",function(){
                var nickName = $nickNameInput.val(),nameLen = commonUtils.strlen(nickName);
                var nickName =nickName.replace(/\s+/g,"");
                if(nameLen >20 || nameLen < 1||nickName==''){
                    commonUtils.alert("昵称长度不符合！");
                    return;
                }
                var data = {to:"updateInfo",type:"User",body:{
                    "userId":userId,
                    "nickname":nickName
                }
                }
                commonUtils.ajaxRequest({data:data,successCallback:function(data){
                    if(data.result){
                        window.history.go(-1);
                    }
                    else{
                        commonUtils.showTip(data.msg);
                    }
                },url:apiConfig.userApi});
            });    
        };
        return {
            'init':init
        }
    }
);