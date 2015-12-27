define(["jquery", "commonUtils",'libs/plugins/swiper/swiper.min'],
    function($, utils,swiper) {
        var user = {},
            imgArr=[],
            localImgArr = [],
            imgArrStorage ='',
            userId = '',
            commentId='',
            satisfyType=2,
            satisfyRemark='',
            salonId='',
            itemId='',
            evaluateContent='',
            config,
            $modifyReputationBtn =$('#modifyReputationBtn'),
            $verySatistied =$('#verySatistied'),
            $hasSatistied = $('#hasSatistied'),
            $wordCount =$('#wordCount'),
            $userImgUrl =$('#userImgUrl'),
            orderTicketId = '',
            $replyContent =$('#replyContent'),
            $consumeTextarea =$('#consumeTextarea'),
            $releaseEvaluateBtn =$('#releaseEvaluateBtn'),
            $uploadBtn=$('#uploadBtn'),
            $edbRedpacketBtn =$('#edbRedpacketBtn');
        var init = function(){
            user =  utils.checkLogin();
            if(user){
                userId = user.userId;
            }
            utils.addBack();
            orderTicketId =utils.getQueryString('orderTicketId');
            satisfyRemark = utils.getQueryString("satisfyRemark");
            salonId = utils.getQueryString("salonId");
            itemId = utils.getQueryString("itemId");

            myEvaluateDetail.getEvaluateDetailData();
            //该好评初始化
            myEvaluateDetail.addModifySatisfyListener();
            //改好评发布
            myEvaluateDetail.getModifySatisfyReleaseData();
            //监听评价内容可输入的字数
             //监听评价内容可输入的字数
            $consumeTextarea.on('input',function(){
                var textareaVal = $(this).val(),textareaLen = textareaVal.length;
                $wordCount.text(140-textareaLen).removeClass('main-color');
                if(textareaLen>=135&&textareaLen<140){
                    $wordCount.addClass('main-color');
                }
                else if(textareaLen>=140){
                    $wordCount.text(0);
                    $consumeTextarea.val(textareaVal.substring(0,140));
                }
            });    
            //七牛
             qiniu.init();
            getWxConfigData();
        };
        var myEvaluateDetail ={
            getEvaluateDetailData:function(){
                var data = {
                    userId:userId,
                    orderTicketId:orderTicketId
                };
             utils.request({data:data,successCallback:this.getEvaluateDetailCallback,url:apiConfig.newApi+"user/comment.html"});
            },
            getEvaluateDetailCallback :function(data){
                if(data.code==0){
                    var evaluateDetailData = data.response,
                        satisfyType = evaluateDetailData.satisfyType;
                    if(satisfyType == "不满意"){
                        satisfyType='不满意';
                        $('#edbtEvaluateResult').removeClass('edbt-has-satisfied').addClass('edbt-not-satisfied');
                    }

                    $('#edbtItemName').text(evaluateDetailData.itemName);
                    $('#edbtSalonName').text(evaluateDetailData.salonName);
                    $('#edbtEvaluateTime').text(evaluateDetailData.addTime);
                    $('#edbtEvaluateResult').text(satisfyType);
                    if(evaluateDetailData.canLaisee == "Y"){
                        if(evaluateDetailData.isValidLaisee!='Y'){
                            $edbRedpacketBtn.text('分享');
                        }
                        $edbRedpacketBtn.show().off("click").on('click',function(){
                            var data = {
                                orderTicketId:orderTicketId
                            };
                            utils.request({
                                data:data,
                                successCallback:function(data){
                                    if(data.code == 0){
                                        wxShare.initData(data.response);
                                        $("#coverShare").show().off("click").on("click",function(){
                                            $(this).hide();
                                        });
                                    }
                                    else{
                                        utils.showTip(data.message);
                                    }
                                },
                                url:apiConfig.newApi+"laisee/creat-laisee.html"
                            });
                        });
                    }
                    evaluateContent = evaluateDetailData.content;
                    if(evaluateContent!=''){
                        $('#edbText').text(evaluateContent);
                    }else{
                        $('#edbText').hide();
                    }
                    //改好评
                    if(satisfyType.indexOf("不满意")!=-1){
                        $modifyReputationBtn.show();
                    }
                    //评论图片
                    var evaluateImgArr = evaluateDetailData.images||[];
                    imgArrStorage = evaluateImgArr;
                    if(evaluateImgArr.length>0){
                        var evaluateImgStr ='';
                        var $imgDiv2 = $("#edbImgBox");
                        for(var j=0,len = evaluateImgArr.length;j<len;j++){
                            if(j<5){
                                evaluateImgStr += '<div><img class="evaluate-img" src="'+ evaluateImgArr[j].thumb.url +'" bigImgSrc="'+evaluateImgArr[j].image.url+'" picIndex="' + j + '"></div>';
                            }
                            $imgDiv2.html(evaluateImgStr);
                        }
                        $('.evaluate-img').on("click",function(){
                            var index = $(this).attr("picIndex");
                            utils.showSwipeBox(evaluateImgArr,{initialSlide:index});
                        });
                    }
                    else{
                        $('#edbNoImgTips').show();
                    }
                    $replyContent.text(evaluateDetailData.reply);
                    if($replyContent.text()==''){
                        $replyContent.hide();
                    }
                }
            },
            addModifySatisfyListener:function(){
                $('#verySatistied,#hasSatistied').on('click',function(){
                    $(this).addClass('ecbrl-on').attr('data-status','on').parent('li').siblings().find('.ecbrl-status').removeClass('ecbrl-on');
                    satisfyType = $(this).attr('satisfyType');
                });
                $modifyReputationBtn.on('click',function(){
                    $('#edbWrap,#edbtEvaluateResult').hide();
                    $(this).hide();
                    $('.ecbrl-status').siblings('.satisty-num').show();
                    $('#modifyReputationWrap').show();
                    $releaseEvaluateBtn.show();
                    //渲染初次评价时的图片
                    var iArrStorageLen = imgArrStorage.length;
                    var imgStr='';
                    for(var i=0;i<iArrStorageLen;i++){
                        imgArrStorage[i] = {img:imgArrStorage[i].image.url,thumbimg:imgArrStorage[i].thumb.url}
                        if(i < 5){
                            var $imgDiv = $("#uploadImgDiv > div").eq(i);
                            imgStr = '<div class="img" style="background-image:url('+ imgArrStorage[i].thumbimg +')" bigImgSrc="'+imgArrStorage[i].img+'"</div>';
                            $imgDiv.html(imgStr);
                        }
                        else{
                            break;
                        }
                    }
                    if(iArrStorageLen >= 5){$uploadBtn.hide();}

                    var data = {to:"commentInit",type:"Order",
                        body:{
                            userId:userId,
                            salonId:salonId,
                            itemId:itemId
                        }
                    }
                    utils.ajaxRequest({data:data,successCallback:function(data){
                        if(data.result){
                            var initEvaluateData = data.data.main,
                                remarkData = initEvaluateData.remark,
                                remarkArr = [];
                            $verySatistied.siblings('.satisty-num').text(initEvaluateData.satisfyOne);
                            $hasSatistied.siblings('.satisty-num').text(initEvaluateData.satisfyTwo);
                        }
                    },url:apiConfig.orderApi});
                });
            },
             getModifySatisfyReleaseData :function() {
                $releaseEvaluateBtn.on('click',function(){
                    var selectSatistyLen =$('.mrw-result-list li').find('.ecbrl-on').length;
                    if(selectSatistyLen>0){
                        utils.showLoading();
                        qiniu.upload(function(){
                            imgArr = imgArrStorage.concat(imgArr);
                            evaluateContent =$('#consumeTextarea').val();
                            var data = {to:"doComment",type:"Order",
                                body:{
                                    userId:userId,
                                    orderTicketId:orderTicketId,
                                    salonId:salonId,
                                    itemId:itemId,
                                    satisfyType:satisfyType,
                                    content:evaluateContent,
                                    imgSrc:JSON.stringify(imgArr),
                                    satisfyRemark:'',
                                    type:2
                                }
                            }
                            utils.ajaxRequest({data:data,successCallback:function(data){
                                if(data.result){
                                    var evaluateConsumeData = data.data.main;
                                    itemId = evaluateConsumeData.itemId,
                                    salonId = evaluateConsumeData.salonId;
                                    window.location="evaluateDetail.html?orderTicketId="+orderTicketId+"&itemId="+itemId+"&salonId="+salonId;
                                }else{
                                    utils.alert(data.msg.replace("用户","亲，您"));
                                }   
                            },url:apiConfig.orderApi});
                        })
                    }
                    else {
                        utils.alert('请选择一个评价满意度！');
                    }
                }); 
            },
            renderUploadDiv:function(){
                var tmpImgArr = [].concat(imgArrStorage,localImgArr);
                var imgLen = tmpImgArr.length;
                var imgStr='';
                for(var i=0;i<imgLen;i++){
                    if(i < 5){
                        var $imgDiv = $("#uploadImgDiv > div").eq(i);
                        imgStr = '<div class="img" style="background-image:url('+ tmpImgArr[i].thumbimg +')" bigImgSrc="'+tmpImgArr[i].img+'"</div>';
                        $imgDiv.html(imgStr);
                    }
                    else{
                        break;
                    }
                }
                if(imgLen >= 5){$uploadBtn.hide();}
            }
        }
        /*
        *七牛云
         */
        var qiniu = {
            uploaderObj:null,
            tokenArr:[],
            fileNum:5,
            finishCallback:null,
            init:function(){
                //start proxy 隐藏状态下不能正确配置上传区域的高和宽，因此proxy
                var $btn = $("#uploadBtn");
                $btn.on("click",function(){
                    $btn.next().find("input[type=file]:eq(0)").click();
                })
                //end proxy
                utils.require({
                    fileList:["../../libs/plugins/qiniu/plupload.full.min.js","../../libs/plugins/qiniu/qiniu.min.js"],
                    onFinish:function(){
                        qiniu.getToken(function(){
                            qiniu.initUploader();
                        });
                        
                    }//end onFinish
                });//end require
            },//end initUploader
            getToken:function(cb){
                utils.request({
                    data:{userId:user.userId,type:"2",num:"5"},//type2 评论
                    url:apiConfig.newApi+"/file/qiniu/get-token.html",
                    async:true,
                    successCallback:function(data){
                        qiniu.tokenArr = data.response.data;
                        if(cb){
                            cb();
                        }
                    }
                });
            },//end getToken
            initUploader:function(){
                var tokenObj;
                if(qiniu.tokenArr.length>0){
                    tokenObj = qiniu.tokenArr.shift();
                }else{
                    qiniu.getToken(qiniu.initUploader);
                    return;
                }
                this.uploaderObj = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: 'uploadBtn',       //上传选择的点选按钮，**必需**
                domain: apiConfig.qiniuServerApi,   //bucket 域名，下载资源时用到，**必需**
                max_file_size: tokenObj.maxFileSize+"mb",           //最大文件体积限制
                filters: {
                  mime_types : [
                        { title : "Image files", extensions : "jpg,gif,png,jpeg" },
                      ]
                },
                uptoken:tokenObj.uptoken,
                auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                        'FilesAdded': function(up, files) {
                           $.each(files,function(key,val){
                                if(imgArrStorage.length!=0&&(localImgArr.length+imgArrStorage.length)>=5){//基保存了图片，满5张后 先移除之前的
                                    imgArrStorage.shift();
                                }else if(localImgArr.length+imgArrStorage.length>=5){//保存的图片移除完毕，超过5张，移除本地的
                                    localImgArr.shift();
                                }
                               var imgURL =  webkitURL.createObjectURL(val.getNative())||URL.createObjectURL(val.getNative());
                               localImgArr.push({img:imgURL,thumbimg:imgURL});
                            });
                           if(files.length>5){
                                utils.showTip('最多只能上传5张照片！');
                            }
                           myEvaluateDetail.renderUploadDiv();
                           qiniu.uploaderObj.refresh();
                        },
                        'BeforeUpload': function(up, file) {
                            up.setOption({
                                'multipart': true,
                                'multipart_params': {'token':tokenObj.uptoken}
                            });
                            tokenObj = qiniu.tokenArr.shift();
                        },
                        'UploadProgress': function(up, file) {
                        },
                        'FileUploaded': function(up, file, info) {
                             if(typeof info === "string"){
                                info = JSON.parse(info);
                              }//json-str to json
                              if(info.response){
                                 var img ={img:info.response.img,thumbimg:info.response.thumbimg};
                                     imgArr =imgArr.concat(img);
                              }//check the response 
                              localImgArr.shift();//上传完毕,从本地列表中删除
                              if(localImgArr.length == 0){//上传完毕
                                qiniu.uploaderObj.stop();
                                qiniu.finishCallback();
                              }
                              
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
                            //return tokenObj.fileName
                        }
                    }
                });
                
            },//end initUploader
            upload:function(finishCallback){
                if(localImgArr.length == 0 && finishCallback){//上传完毕
                    finishCallback();
                    return;
                }
                qiniu.finishCallback = finishCallback;
                qiniu.uploaderObj.start();
            }//end upload
        };//end qiniu

        var wxShare = {
            shareTimelineData:{
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                link: window.location.href.split("#")[0],
                imgUrl: "http://" + window.location.host + "/module/sf/img/share.png",
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    //commonUtils.alert('已分享到朋友圈');
                },
                cancel: function (res) {
                    //commonUtils.alert('已取消分享到朋友圈');
                },
                fail: function (res) {
                    //commonUtils.alert('分享到朋友圈失败！');
                }
            },
            shareAppMessageData:{
                title: '万水千山总是情，一起臭美行不行~送你X个美发红包，一起换个新发型吧！',
                desc: '良辰最喜欢对那些跟我关系好的人出手了，拯救你们的发型，就用臭美App！', // 分享描述
                link: window.location.href.split("#")[0],
                imgUrl:  "http://" + window.location.host + "/module/sf/img/share.png",
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                trigger: function (res) {
                    //alert('用户点击分享到朋友');
                },
                success: function () {
                    // 用户确认分享后执行的回调函数
                    //commonUtils.alert('已分享到朋友');
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    //commonUtils.alert('已取消分享到朋友');
                },
                fail: function () {
                    //commonUtils.alert('分享到朋友失败！');
                }
            },
            initData:function(data){
                wxShare.shareAppMessageData.title = wxShare.shareTimelineData.title = data.wechatTitle;
                wxShare.shareAppMessageData.link = wxShare.shareTimelineData.link = data.h5URL;
                wxShare.shareAppMessageData.imgUrl = wxShare.shareTimelineData.imgUrl = data.imgURL;
                wxShare.shareTimelineData.desc = data.wechatContent;
            },
            wxCallback: function( config ){
                if( wx ){
                    wx.config({
                        debug: false,
                        appId: config.appId,
                        timestamp: config.timestamp,
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature,// 必填，签名，见附录1
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function(){
                        wx.checkJsApi({
                            jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                // 以键值对的形式返回，可用的api值true，不可用为false
                                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                                var result;
                                if( typeof res == "string"){
                                    result = $.parseJSON( res );
                                }else if( typeof  res == "object" ){
                                    result = res;
                                }
                                if( result.checkResult.onMenuShareTimeline ){
                                    wx.onMenuShareTimeline(wxShare.shareTimelineData);
                                }
                                else{
                                    utils.alert("分享到朋友圈功能不可用！");
                                }
                                if( result.checkResult.onMenuShareAppMessage ){
                                    // 2.3 监听“分享到朋友”按钮点击、自定义分享内容及分享结果接口
                                    wx.onMenuShareAppMessage(wxShare.shareAppMessageData);
                                } else{
                                    utils.alert("分享给朋友功能不可用！");
                                }
                            },
                            fail: function(){
                            }
                        });
                    });
                    wx.error(function(res){
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    });
                }
            }
        };

        var getWxConfigData = function(){
            var data = {
                to: 'signPackage',
                type: 'Wechat',
                body: {
                    url:  window.location.href.split("#")[0]
                }
            }
            utils.ajaxRequest({
                data:data,
                successCallback:function (data) {
                    if (data.result == 1) {
                        var config = data.data.main ;
                        wxShare.wxCallback( config );
                    } else {
                        utils.alert(data.msg);
                    }
                },
                url:apiConfig.userApi
            });
        };

        return{
            'init':init
        };
    }
)
