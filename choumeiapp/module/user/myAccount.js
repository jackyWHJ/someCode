define(["jquery", "commonUtils"],
    function($, utils) {
        var user = {},userId = "",cityList = [],indexCityList = [],indexCountyList= [],nickName='',avatar='',cityIndex= 0,countryIndex =0,newCityIndex =0;
        var $userImgUrl = $("#userImgUrl");
        var init = function(){
            user =  JSON.parse(window.sessionStorage.getItem("user")||window.localStorage.getItem("user"));
            if(user){
                userId = user.userId;
            }
            else{
                utils.authorize();
                return;
            }
            //为了检容老版本 先检测accessToken
            if(!user.accessToken){
                utils.alert("你的登录信息失效！请重新登录！");
                window.sessionStorage.setItem("location",window.location);
                location = "userLogin.html";
            }
            utils.addBack();
            utils.addMenu();
            initProvinceSelect();
            initDateSelect();
            getPersonInfo();
            qiniu();

            $("#loginOutBtn").on("click",function(){
                utils.confirm("确定退出当前账号吗？",function(isOK){
                    if(isOK){
                        window.sessionStorage.removeItem("user");
                        window.localStorage.removeItem("user");
                        window.sessionStorage.setItem("location",window.location);
                        var locate = "userLogin.html";
                        window.location = locate;
                        /*commonUtils.request({
                         data:{userId:userId},
                         url:apiConfig.newApi+"user/login-out-h5.html",
                         successCallback:function(){
                         window.location = locate;
                         }
                         })*/
                    }else{
                        return;
                    }
                });
            });

            //昵称修改点击监听
            $("#nickNameBtn").on("click",function(){
                window.location ='setName.html';
            });
        };

        /**
         * 初始化省份选择器
         * */
        var initProvinceSelect = function(){
            var optionStr = '<option value="-1">不选</option>';cityList = areaObj.citylist;
            for(var i = 0,len = cityList.length;i < len;i++){
                optionStr += '<option value="'+i+'">'+cityList[i].p+'</option>';
            }
            $("#provinceSelect").html(optionStr);
    //        $("#province-span").text(cityList[0].p);

            $("#provinceSelect").on("change",function(){
                cityIndex = $(this).val();
                if(cityIndex == -1){
                    return;
                }
                $("#province-span").text(cityList[cityIndex].p);
                $("#city-span").text(cityList[cityIndex].c[0].n);
                initCitySelect();
                //setArea();
                window.sessionStorage.setItem("cityIndex",cityIndex);
                window.localStorage.setItem("cityIndex",cityIndex);
            });
            if(JSON.parse(window.sessionStorage.getItem("cityIndex")||window.localStorage.getItem("cityIndex"))){
                cityIndex =JSON.parse(window.sessionStorage.getItem("cityIndex")||window.localStorage.getItem("cityIndex"));
            }
            initCitySelect();
        };

        /**
         * 初始化城市选择器
         * */
        var initCitySelect = function(){
            var optionStr = '<option value="-1">不选</option>';indexCityList = cityList[cityIndex].c;
            for(var i = 0,len = indexCityList.length;i < len; i++){
                optionStr += '<option value="'+i+'">'+indexCityList[i].n+'</option>';
            }
            // $("#citySelect").html(optionStr);
            $("#citySelect").html(optionStr);
            $("#citySelect").on("change",function(){
                countryIndex = $(this).val();
                if(countryIndex == -1){
                    return;
                }
                $("#city-span").text(indexCityList[countryIndex].n);
                if(indexCityList[countryIndex].a){
                    //$('#countrySelect,.country-split,.country-wrap').show();
                    $('#countrySelect').show();
                    $("#country-span").text(indexCityList[countryIndex].a[0].s);
                   // setArea();
                    initCountySelect();
                }
                else{
                    $("#country-span").text("");
                    $("#countrySelect").unbind("change");
                    $("#countrySelect").html('<option value=""></option>');
                    $('#countrySelect').hide();
                   // $('#countrySelect,.country-split,.country-wrap').hide();
                    setArea();
                }
                window.sessionStorage.setItem("countryIndex",countryIndex);
                window.localStorage.setItem("countryIndex",countryIndex);
            });
            if(JSON.parse(window.sessionStorage.getItem("countryIndex")||window.localStorage.getItem("countryIndex"))){
                countryIndex =JSON.parse(window.sessionStorage.getItem("countryIndex")||window.localStorage.getItem("countryIndex"));
            }
            if(indexCityList[countryIndex].a){
                initCountySelect();
            }
        };

        /**
         * 初始化县选择器
         * */
        var initCountySelect = function(){
            var optionStr = '<option value="-1">不选</option>'; indexCountyList = cityList[cityIndex].c[countryIndex].a;
            for(var i = 0,len = indexCountyList.length;i < len; i++){
                optionStr += '<option value="'+i+'">'+indexCountyList[i].s+'</option>';
            }
            // $("#countrySelect").html(optionStr);
            $("#countrySelect").html(optionStr);
    //        $("#country-span").text(indexCountyList[0].s);
            $("#countrySelect").unbind("change");
            $("#countrySelect").bind("change",function(){
                var idx = $(this).val();
                if(idx == -1){
                    return;
                }
                $("#country-span").text(indexCountyList[idx].s);
                setArea();
            });
        };


        /**
         * 初始化日期选择器
         * */
        var initDateSelect = function(){
            if(navigator.userAgent.indexOf('Android')>-1){
                var input=$('#dateInput');
                input.data('value',input.val());
                var inteId = setInterval(function(){
                    if(input.data('value')!=input.val()){
                        $('#dateVal').text(input.val());
                        setDate();
    //                    clearInterval(inteId);
                    }
                },1000);
            }else{
                $('#dateInput').on('change',function(){
                    $('#dateVal').text($(this).val());
                    setDate();
                });
            }
        };
        //修改图像信息
        var getAvatarInfo = function(){
            var data = {to:"updateInfo",type:"User",body:{
                'userId':userId,
                'img':avatar
            }
            };
            utils.ajaxRequest({data:data,successCallback:function(data){
                if(data.result){}
            },url:apiConfig.userApi});
        }
        /**
         * 获取个人信息
         * */
        var getPersonInfo = function(){
            var data = {to:"info",type:"User",body:{'userId':userId}};
            utils.ajaxRequest({data:data,successCallback:getUserInfoCallback,url:apiConfig.userApi});
        };

        /**
         * 初始化页面选项
         * */
        var getUserInfoCallback = function(data){
            if(data.result){
                var userData = data.data.main.user;
                user = $.extend(true,user,userData);
                window.sessionStorage.setItem("user",JSON.stringify(user));
                window.localStorage.setItem("user",JSON.stringify(user));
                //qiniu云图片上传参数
                $("#imgForm").append("<input type='hidden' name='userId' value='1'><input type='hidden' name='type' value='1'>");

                if(user.img){
                    //头像
                    $("#userImg").css("background-image","url("+user.img+")");
                }
                //昵称
                $("#nickName").text(user.nickname);
                //性别
                if(user.sex){
                    if(user.sex == 1){
                        $("#sex-span").text("女");
                    }
                    else if(user.sex == 2){
                        $("#sex-span").text("男");
                    }
                    $("#sexSelect").val(user.sex);
                }

                //发长
                if(user.hairType){
                    if(user.hairType == 1){
                        $("#hair-span").text("长发");
                    }
                    else if(user.hairType == 2){
                        $("#hair-span").text("中发");
                    }
                    else if(user.hairType == 3){
                        $("#hair-span").text("短发");
                    }
                    $("#hairSelect").val(user.hairType);
                }

                //地区
                if(user.area){
                    var areaArr = user.area.split(",");
                    if(areaArr.length > 1){
                        var provinceStr = areaArr[0] || "",cityStr = areaArr[1] || "";
                        $("#provinceSelect").val(provinceStr);
                        $("#province-span").text(provinceStr);
                        $("#citySelect").val(cityStr);
                        $("#city-span").text(cityStr);
                        $('#countrySelect').hide();
                    }
                    if(areaArr.length > 2){
                        $("#countrySelect").show().val(areaArr[2]);
                        $("#country-span").text(areaArr[2]);
                    }
                }

                //
                if(user.birthday){
                    $('#dateVal').text(user.birthday);
                }
                //绑定手机
                if(user.mobilephone){
                    $('#mabBindTel').text(user.mobilephone.substring(0,3)+'****'+user.mobilephone.substring(7,11));
                }
            }
            else{
                utils.showTip(data.msg);
            }
            addPageListener();
        }
        /**
         * 添加页面监听
         * */
        var addPageListener = function(){
            //性别选择器监听
            $("#sexSelect").on("change",function(){
                $("#sex-span").html($(this).find("option:selected").text());
                setSex();
            });
            //发长选择器监听
            $("#hairSelect").on("change",function(){
                $("#hair-span").html($(this).find("option:selected").text());
                setHair();
            });

            //年份选择器
            $("#yearSelect").on("change",function(){
                $("#year-span").html($(this).val());
            });
        };



        /**
         * 设置地区信息
         * */
        var setArea = function(){
            // var provinceStr = $("#provinceSelect").find("option:selected").text(),
            //     cityStr = $("#citySelect").find("option:selected").text(),
            //     countryStr = $("#countrySelect").find("option:selected").text(),
            var provinceStr = $("#province-span").text(),
                cityStr = $("#city-span").text(),
                countryStr = $("#country-span").text(),
                areaStr = "";
            if(countryStr){
                areaStr = provinceStr+","+cityStr+","+countryStr;
            }
            else{
                 areaStr = provinceStr+","+cityStr;
            }
            var data = {to:"updateInfo",type:"User",body:{
                "userId":userId,
                "area":areaStr
            }
            }
            utils.ajaxRequest({data:data,successCallback:function(data){
                if(data.result){
    //                commonUtils.showTip('成功修改地区信息!');
                }
                else{
                    utils.showTip(data.msg);
                }
            },url:apiConfig.userApi});
        };

        /**
         * 设置性别信息
         * */
        var setSex = function(){
            var sex = $("#sexSelect").val();
            var data = {to:"updateInfo",type:"User",body:{
                "userId":userId,
                "sex":sex
            }
            }
            utils.ajaxRequest({data:data,successCallback:function(data){
                if(data.result){
    //                commonUtils.showTip('成功修改性别信息!');
                }
                else{
                    utils.showTip(data.msg);
                }
            },url:apiConfig.userApi});
        };

        /**
         * 设置发长信息
         * */
        var setHair = function(){
            var hairType = $("#hairSelect").val();
            var data = {to:"updateInfo",type:"User",body:{
                "userId":userId,
                //"hairType":hairType
                "hairtype":hairType
            }
            }
            utils.ajaxRequest({data:data,successCallback:function(data){
                if(data.result){
    //                commonUtils.showTip('成功修改性别信息!');
                }
                else{
                    utils.showTip(data.msg);
                }
            },url:apiConfig.userApi});
        };

        /**
         * 设置日期
         * */
        var setDate = function(){
            var   birthday = $('#dateVal').text();
            var data = {to:"updateInfo",type:"User",body:{
                "userId":userId,
                "birthday":birthday
            }
            }
            utils.ajaxRequest({data:data,successCallback:function(data){
                if(data.result){
    //                commonUtils.showTip('成功修改生日信息!');
                }
                else{
                    utils.showTip(data.msg);
                }
            },url:apiConfig.userApi});
        };

        /*
         *七牛云
         */
        function qiniu(){
            var headImg = $("#userImg");
            utils.require({
                fileList:["../../libs/plugins/qiniu/plupload.full.min.js","../../libs/plugins/qiniu/qiniu.min.js"],
                onFinish:function(){
                    var tokenObj;
                    var getToken = function(){
                        utils.request({
                            data:{userId:user.userId,type:"1",num:"1"},
                            url:apiConfig.newApi+"/file/qiniu/get-token.html",
                            async:true,
                            successCallback:function(data){
                                tokenObj = data.response.data[0];
                                initUploader();
                            }
                        });
                    }
                    var initUploader = function(){
                        var uploaderObj = Qiniu.uploader({
                            runtimes: 'html5',    //上传模式,依次退化
                            browse_button: 'userImg',       //上传选择的点选按钮，**必需**
                            domain: apiConfig.qiniuServerApi,   //bucket 域名，下载资源时用到，**必需**
                            max_file_size: tokenObj.maxFileSize+"mb",           //最大文件体积限制
                            filters: {
                                mime_types : [
                                    { title : "Image files", extensions : "jpg,gif,png,jpeg" },
                                ]
                            },
                            uptoken:tokenObj.uptoken,
                            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                            init: {
                                'FilesAdded': function(up, files) {

                                },
                                'BeforeUpload': function(up, file) {
                                },
                                'UploadProgress': function(up, file) {
                                },
                                'FileUploaded': function(up, file, info) {
                                    if(typeof info === "string"){
                                        info = JSON.parse(info);
                                    }
                                    var imgUrl = info.response.img;
                                    headImg.css("background-image","url("+imgUrl+")");
                                    avatar = imgUrl;
                                    getAvatarInfo();
                                    uploaderObj.destroy();
                                    getToken();
                                },
                                'Error': function(up, err, errTip) {
                                    if(err.message=="File size error."){
                                        utils.alert("文件大小不能超过"+tokenObj.maxFileSize+"mb");
                                    }else{
                                        utils.alert(errTip);
                                    }
                                },
                                'UploadComplete': function() {
                                    //队列文件处理完毕后,处理相关的事情
                                },
                                'Key': function(up, file) {
                                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                    // 该配置必须要在 unique_names: false , save_key: false 时才生效,key即为上传文件名
                                    return tokenObj.fileName
                                }
                            }
                        });//Qiniu.uploader
                    }//end uploader
                    getToken();
                }//end onFinish
            });//end require
        };//end qiniu

        return{
            'init':init
        }
    }
)
