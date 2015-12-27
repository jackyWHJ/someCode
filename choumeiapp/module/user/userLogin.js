/**
 * Created by jacky(王浩杰) on 14-11-18.
 * email:719810496@qq.com
 * Copyright (C) 2014 choumei.cn.
 */
define(["jquery", "commonUtils",'utils/module/tongdun'],
    function($, commonUtils,td) {
        var timeIntervalId = 0,phoneNum="",codeTime = 60,code = "";//responseTimer = 获取验证码服务器响应计时器
        var $voice = $("#voice");
        var init = function(){
            //输入监听
            commonUtils.addBack();
            commonUtils.addMenu();
            $("#phone").on("input",function(){
                phoneNum = $("#phone").val();
                if(phoneNum.length == 11){
                    //重新修改后 清除计时器
                    clearInterval(timeIntervalId);
                    $("#getCode").html("获取验证码");
                    $("#getCode").removeClass("get-code-btn-enable");
                    $voice.addClass('active');
                    addGetCodeClick();
                }
                else{
                    $("#getCode").unbind("click").addClass("get-code-btn-enable");
                    $voice.removeClass('active');
                }
            });
            $("#code").on("input",function(){
                phoneNum = $("#phone").val();
                code = $("#code").val();
                if(code.length == 4 && phoneNum.length == 11){
                    addLoginBtnClick();
                }
                else{
                    $("#loginBtn").unbind("click").addClass("enable-btn-color");
                }
            });

        };

        /**
         * 登录动作
         * */
        var loginAction = function(){

            tongdun({url:"user/login.html",data:{"mobilePhone":phoneNum,"authCode":code}});

            var data = {to:"index",type:"Login",body:{
                userId:"","mobilephone":phoneNum,"authcode":code}};
            commonUtils.ajaxRequest({data:data,successCallback:loginCallback,url:apiConfig.userApi});
        };
        /**
         * 登录回调函数
         * */
        var loginCallback = function(data){
            console.log(data);
            if(data.result){
                var locate = window.location.toString().substring(0,window.location.toString().indexOf("module/"))+"module/",
                    user = data.data.main;
                commonUtils.user = user;
                window.localStorage.setItem("accessToken",user.accessToken);
                window.localStorage.setItem("refreshToken",user.refreshToken);
                window.sessionStorage.setItem("user",JSON.stringify(user));
                window.localStorage.setItem("user",JSON.stringify(user));
                var redirectLocation = window.sessionStorage.getItem("location");
                //返回登录之前页面
                if(user.newUser && user.newUser == 1){
                    locate += 'user/activatePromocode.html';
                }
                else if(redirectLocation){
                    locate = redirectLocation;
                }
                else{
                    locate += 'salon/salonList.html';
                }
                if(commonUtils.isOpenInWechat()){
                    window.location = apiConfig.newApi+"user/bind-openid-h5.html?request={'userId':'"+user.userId+"'}&h5_redirect_url="+locate;
                }
                else{
                    window.location = locate;
                }
            }
            else{
                if(1 == data.errcode){
                    commonUtils.alert("你还没注册！");
                }
                else{
                    commonUtils.alert(data.msg);
                }
            }
        };
        /**
         * 添加登录按钮点击监听
         * */
        var addLoginBtnClick = function(){
            $("#loginBtn").unbind("click");
            //登录按钮
            $("#loginBtn").bind("click",function(){
                code = $("#code").val();
                if(!checkPhone())return;
                if(code.length != 4){
                    commonUtils.alert("验证码错误！");
                    return;
                }
                loginAction();
            }).removeClass("enable-btn-color");
        };
        /**
         * 添加获取验证码监听
         * */
        var addGetCodeClick = function(){
            var phoneNum = 0;
            $("#getCode").unbind("click");
            $("#getCode").bind("click",function(){
                phoneNum = $("#phone").val();
                if(!checkPhone())return;
                codeTime = 60;
                tongdun({url:"sms/auth-code/login.html",data:{"mobilePhone":phoneNum}});
                commonUtils.request(
                    {data:{userId:"","mobilephone":phoneNum},successCallback:getCodeCallback,url:apiConfig.newApi+"captcha/sms.html"}
                );
            });
        };
        /**
         * 获取验证码回调
         * */
        var getCodeCallback = function(data){

            if(data.code == 0){
                clearInterval(timeIntervalId);
                timeIntervalId = setInterval(setCodeLabel,1000);
                $("#getCode").addClass("get-code-btn-enable");
                $("#getCode").html("重新获取"+codeTime+"s");
                $("#getCode").unbind("click");
            }
            else{
                commonUtils.alert(data.message);
                $("#getCode").removeClass("get-code-btn-enable");
                $("#getCode").html("获取验证码");
                addGetCodeClick();
            }
        }
        /**
         * 设置计时按钮
         * */
        var setCodeLabel = function(){
            codeTime --;
            if(codeTime <= 0){
                clearInterval(timeIntervalId);
                $("#getCode").removeClass("get-code-btn-enable");
                $("#getCode").text("获取验证码");
                addGetCodeClick();
            }
            else{
                $("#getCode").text("重新获取"+codeTime+"s");
            }
        };
        var checkPhone = function(){
            if(commonUtils.isPhone(phoneNum)){
                window.sessionStorage.setItem("phone",phoneNum);
            }
            else{
                commonUtils.alert("手机号码格式错误！");
                return false;
            }
            return true;
        };

        var voiceClickableTimer,voiceTipTimer;
        /*
         *语音验证码
         *
         */
        var getVoiceCallback = function(data){
            if(data.code == 0){
                $voice.removeClass('active');
                //60s 后重置可使用状态
                clearTimeout(voiceClickableTimer);
                voiceClickableTimer = setTimeout(function(){
                    $voice.addClass("active");
                },60000);

                //30s 后重隐藏提示信息
                $("#lg-vt-phone").html(data.response.displayNum);
                $("#showVoiceTip").show();
                clearTimeout(voiceTipTimer);
                voiceClickableTimer = setTimeout(function(){
                    $("#showVoiceTip").hide();
                },30000);
            }else{
                commonUtils.alert(data.message);
            }
        };
        $voice.on("click",function(){
                if($voice.hasClass('active')){
                    commonUtils.request(
                        {data:{mobilephone:phoneNum},successCallback:getVoiceCallback,url:apiConfig.newApi+"captcha/voice.html"}
                    );
                }
            }
        );

        return{
            'init':init
        };
    }
);

