define(["jquery", "commonUtils"],function($, utils) {
        var user = {},userId = "";
        var init = function(){
			
            user =  utils.checkLogin();
            if(user){
                userId = user.userId;
            }       
            addFeedbackListener();
            addListener();
			utils.addBack();
				utils.addMenu();
			 // $("#back").on("click", function(e){
            // window.location = "myPage.html";
			// });
        }
        /**
         * 添加反馈页面提交按钮点击监听
         * */
        var addFeedbackListener =function(){
            $("#sfSubmit").on("click",function(){
                var content=$('#sfTextarea').val();
                var data = {to:"feedback",type:"User",
                    body:{
                        userId:userId,
                        content:content
                    }
                }
                utils.ajaxRequest({data:data,successCallback:function(data){
                    if(data.result){                        
                        utils.showTip('您的意见反馈成功!');
                        setTimeout(function(){
                            window.history.go(-1);
                        },500);
                    }
                },url:apiConfig.userApi});
            });
        }
         /**
         * 添加反馈页面按钮点击监听
         * */
        var addListener=function(){
            var $coverBoxs = $('#coverBoxs');
            $('#si-emails').on('click',function(){
                $coverBoxs.show();
            });
            $('#email-cancelBtn,#callBtn').on('click',function(){
                $coverBoxs.hide();
            });

            var $coverBox = $('#coverBox');
            $('#si-phone').on('click',function(){
                $coverBox.show();
            });
            $('#phone-cancelBtn,#phone-callBtn').on('click',function(){
                $coverBox.hide();
            });
        }
        return{
            'init':init
        };
    }
)

