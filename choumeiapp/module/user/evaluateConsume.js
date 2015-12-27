define(["jquery", "commonUtils",'libs/plugins/iscroll-min'],
    function($, utils,iscroll) {
    	var user = {},userId = '';
	    var img='',
	        localImgArr = [],
	        imgArr = [], 
	        evaluateItemNameText ='',
	        salonId='',
	        itemId='',
	        orderTicketId='',
	        itemCommentId='',
	        satisfyType=1,
	        evaluateContent='',
	        satisfyRemark='',
	        hairStylistId='',
	        stylistListData;
            $writeEvaluateContent = $('#writeEvaluateContent'),
	        $releaseEvaluateBtn=$('#releaseEvaluateBtn'),
	        $wordCount = $('#wordCount'),
	    	$verySatistied =$('#verySatistied'),
	    	$hasSatistied = $('#hasSatistied'),
	    	$notSatistied =$('#notSatistied'),
	    	$notSatisfiedStatusBox=$('#notSatisfiedStatusBox'),
	    	$consumeTextarea =$('#consumeTextarea'),
	    	$uploadBtn =$('#uploadBtn'),
	    	$stylistListBox = $('#stylistListBox'),
	    	$selectStylist=$('#selectStylist'),
	    	$coverBg =$('#coverBg'),
	    	$scroller =$('#scroller');
	    var flag =false,publishLocked = false;//publishLocked用于发布锁定，避免重复发布
		var init = function(){
			user =  utils.checkLogin();
		    if(user){
		        userId = user.userId;
		    }
            utils.addBack();
		    evaluateItemNameText = utils.getQueryString("evaluateItemName");
	        salonId = utils.getQueryString("salonId");
	        itemId = utils.getQueryString('itemId');
	        orderTicketId =utils.getQueryString('orderTicketId');
	        $('#edbItemName').text(evaluateItemNameText);
	        //初始化评价的数
	        myEvaluateConsume.getEvaluateInitData();
	        //评价的监听
	        myEvaluateConsume.addEvaluateClickListener();
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
	        //get造型师列表
	        myEvaluateConsume.getStylistListData();	
	        //show造型师列表
	        myEvaluateConsume.selectStylist();

		};
		var myEvaluateConsume ={
			//评价的监听
			addEvaluateClickListener:function(){
				$('#verySatistied,#hasSatistied,#notSatistied').on('click',function(){
					satisfyType = $(this).attr('satisfyType');
					$consumeTextarea.val('');
					$('.ecbrl-status').siblings('.satisty-num').show();
					$(this).addClass('ecbrl-on').attr('data-status','on').parent('li').siblings().find('.ecbrl-status').removeClass('ecbrl-on');
					if(stylistListData.length<=0){
						$selectStylist.hide();
					}
				});
				//非常满意
				//满意
				$('#verySatistied,#hasSatistied').on('click',function(){
					$releaseEvaluateBtn.addClass('main-color');
					$writeEvaluateContent.show();
					$notSatisfiedStatusBox.hide();
					// $consumeTextarea.val('').attr('placeholder','感谢您对本次服务的认可，记录下您此时的心情吧');
					$consumeTextarea.val('').attr('placeholder','非常好的服务，剪发棒棒哒，下次还再来!');
				})
				//不满意
				$notSatistied.on('click',function(){
					$writeEvaluateContent.hide();
					$notSatisfiedStatusBox.show();
					$releaseEvaluateBtn.removeClass('main-color');
				});

				$releaseEvaluateBtn.on('click',function(){
					if(publishLocked){//已锁定发布，不可重复提交
	                    return;
	                }
				    evaluateContent = $consumeTextarea.val();
				    if($selectStylist.attr('hairStylistId')){
				    	hairStylistId =$selectStylist.attr('hairStylistId');
				    }
				    else{
				    	hairStylistId=='';
				    }
				    var selectSatistyLen =$('.ecb-result-list li').find('.ecbrl-on').length,
				    	selectNotSatistyResultLen = $notSatisfiedStatusBox.find('.not-satistied-current').length;
				    if(satisfyType==1){
				    	//satisfyRemark='很满意';
				    	satisfyType='VERY_SATISFIED';
				    }
				    else if(satisfyType==2){
				    	//satisfyRemark='满意';
				    	satisfyType='SATISFIED';
				    }
				    else if(satisfyType==3){
				    	$notSatisfiedStatusBox.find('li').each(function(index, obj) {
				        	var _dataStatus = $(obj).attr('data-status');
				        	if(_dataStatus=='current'){
				        		satisfyRemark= (index+1);
				        		console.log(satisfyRemark);
				        	}
				        });
				        switch(satisfyRemark){
				        	case 1:
				        		satisfyRemark ='UNSATISFIED_SERVICE';
				        	break;
				        	case 2:
				        		satisfyRemark ='UNSATISFIED_HAIRSTYLE';
				        	break;
				        	case 3:
				        		satisfyRemark ='UNSATISFIED_CHARGE';
				        	break;
				        	default:
				        	break;
				        }
				        satisfyType='UNSATISFIED';
				    }
				    //选择评价满意度提示
				    //if(satisfyType==1||satisfyType==2){
				    if(satisfyType=='VERY_SATISFIED'||satisfyType=='SATISFIED'){
				    	if(selectSatistyLen>0){
	                        utils.showLoading();
	                        publishLocked = true;
	                        if(localImgArr.length>0){
	                            qiniu.upload(function(){
	                                myEvaluateConsume.getEvaluateConsumeData.call(myEvaluateConsume);
	                            });
	                        }//有图片需要上传
				    		else{
	                            myEvaluateConsume.getEvaluateConsumeData();
	                        }
				    	}
				    	else{
				    		utils.alert('请选择一个评价满意度！');
				    	}
				    }
				    else{
				    	if(selectSatistyLen>0&&selectNotSatistyResultLen>0){
	                        utils.showLoading();
	                        publishLocked = true;
				    		if(localImgArr.length>0){
	                            qiniu.upload(function(){
	                                myEvaluateConsume.getEvaluateConsumeData.call(myEvaluateConsume);
	                            });
	                        }//有图片需要上传
	                        else{
	                            myEvaluateConsume.getEvaluateConsumeData();
	                        }
				    	}
				    	else{
				    		utils.alert('请选择一个评价满意度！');
				    	}
				    }
				});
			},
			getEvaluateInitData:function(){
				var data = {to:"commentInit",type:"Order",
					body:{
						userId:userId,
						salonId:salonId,
						itemId:itemId
					}
				}
	        	utils.ajaxRequest({data:data,successCallback:this.getEvaluateInitCallback,url:apiConfig.orderApi});
			},
			getEvaluateInitCallback :function(data){
				if(data.result){
					var initEvaluateData = data.data.main,
						remarkData = initEvaluateData.remark,
						remarkArr = [];
					$verySatistied.siblings('.satisty-num').text(initEvaluateData.satisfyOne);
					$hasSatistied.siblings('.satisty-num').text(initEvaluateData.satisfyTwo);
					$notSatistied.siblings('.satisty-num').text(initEvaluateData.satisfyThree);
					$notSatisfiedStatusBox.html('');
					for(var i=0;i<remarkData.length;i++){
						remarkArr.push('<li>'+remarkData[i]+'</li>');
					}
					$(remarkArr.join('')).appendTo($notSatisfiedStatusBox);
				}
				//不满意选项
				$('#notSatisfiedStatusBox li').on('click',function(){
					$releaseEvaluateBtn.addClass('main-color');
					$writeEvaluateContent.show();
					$notSatisfiedStatusBox.hide();
					//$consumeTextarea.attr('placeholder','写下您不满意的地方吧，我们将督促商家改进');
					$(this).addClass('not-satistied-current').attr('data-status','current');
				});
				/*$('#saveCheck').on('click',function(){
	                flag = $(this).attr('flag');
	                if(flag=='true'){
	                    $(this).find('i').addClass('sh-unselected');
	                    $(this).attr('flag','false');
	                    flag = false;
	                }
	                else{
	                    $(this).find('i').removeClass('sh-unselected');
	                    $(this).attr('flag','true');
	                    flag = true;
	                }
	            });*/
			},
			getEvaluateConsumeData:function(){
				if(imgArr==''){flag = false;}
				var data ={
					userId:userId,
					orderTicketId:orderTicketId,
					itemId:itemId,
					salonId:salonId,
					hairStylistId:hairStylistId,
					satisfyType:satisfyType,
					content:evaluateContent,
					images:JSON.stringify(imgArr),
					satisfyRemark:satisfyRemark,
					saveToAlbum:flag
				}

				utils.request({data:data,successCallback:this.getEvaluateConsumeCallBack,url:apiConfig.newApi+'comment/post-item.html'});
			},
			getEvaluateConsumeCallBack:function(data){
				if(data.code==0){
					var evaluateConsumeData = data.response,
						commentId = evaluateConsumeData.commentId;
					 window.location="evaluateDetail.html?orderTicketId="+orderTicketId+"&commentId="+commentId+"&salonId="+salonId+"&itemId="+itemId;
				}
				else{
	    			utils.alert(data.message.replace("用户","亲，您"));
	    		}
			},
			selectStylist :function(){
				$selectStylist.on('click',function(){
					$coverBg.show().removeClass('opacity-hide').addClass('opacity-show');
					$stylistListBox.show().addClass('pull-left').removeClass('pull-right');	
					$stylistListBox.on('webkitAnimationEnd animationend',function(){
						new IScroll('#stylistListBox', {scrollbars:"",click:true});
					});				  		
				});
				myEvaluateConsume.addStylistListListener();   
				$coverBg.on('click',function(){
					$coverBg.hide().addClass('opacity-hide').removeClass('opacity-show');
					$stylistListBox.removeClass('pull-left').addClass('pull-right');
				});
			},
			getStylistListData:function(){
				var data = {to:"index",type:"Stylist",
					body:{
						userId:userId,
						salonId:salonId
					}
				}
	        	utils.ajaxRequest({data:data,successCallback:function(data){
	        		if(data.result){
	        			    stylistListData = data.data.main,
	        				stylistListDataLen = stylistListData.length,
	        				stylistListArr=[];
	        			for(var i=0;i<stylistListDataLen;i++){
	        				stylistListArr.push('<li hairStylistId='+stylistListData[i].stylistId+'><img onerror="this.src=../../images/user/gerenziliao_touxiang@2x.png" src='+stylistListData[i].stylistImg+'>');
	        				stylistListArr.push('<div class="slb-right"><p class="slbr-name">'+stylistListData[i].stylistName+'</p>');
	        				stylistListArr.push('<p class="slbr-job"><span>'+stylistListData[i].job+'</span><span></span>');
	        				stylistListArr.push('</p></div></li>');
	        			}
	        			$(stylistListArr.join('')).appendTo($scroller);
	        			myEvaluateConsume.addStylistListListener();
	        		}
	        		else{
	        			utils.showTip('网络异常，请稍后再试！');
	        		}
	        	},url:apiConfig.shopApi});
			},
			addStylistListListener:function(){
				$scroller.find('li').on('click',function(){
					hairStylistId = $(this).attr('hairStylistId');
					$(this).find('img').addClass('stylist-on').end().siblings().find('img').removeClass('stylist-on');	
					var stylistName =$(this).find('.slbr-name').text(),
						stylistNum =$(this).find('.slbr-job').find('span').eq(0).text(),
						stylistJob = $(this).find('.slbr-job').find('span').eq(1).text(),
					    stylistStr = stylistName+stylistNum+stylistJob;
					// stylistStr='<span class="wecss-text01">'+stylistName+'</span><span class="wecss-text02">'+stylistNum+'</span><span class="wecss-text03">'+stylistJob+'</span>'; 
					stylistStr='<span class="wecss-text01">选择设计师：'+stylistName+'</span><span class="wecss-text02">'+stylistNum+'</span><span class="wecss-text03">'+stylistJob+'</span>'; 
					$selectStylist.html(stylistStr).attr('hairStylistId',hairStylistId);
					$stylistListBox.removeClass('pull-left').addClass('pull-right');
					$coverBg.hide().addClass('opacity-hide').removeClass('opacity-show');
					setTimeout(function(){
						$stylistListBox.hide();
						$coverBg.hide();
					},300);
				});
			},
		    renderUploadDiv:function(){
		        var imgLen = localImgArr.length;
		        var imgStr='';
		        for(var i=0;i<imgLen;i++){
		            if(i < 5){
		                var $imgDiv = $("#uploadImgDiv > div").eq(i);
		                imgStr = '<div class="img" style="background-image:url('+ localImgArr[i].thumbimg +')" bigImgSrc="'+localImgArr[i].img+'"</div>';
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
	                    qiniu.getToken(function(tokenObj){
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
	                            if((qiniu.fileNum--) <= 0){
	                                localImgArr.shift();
	                            }
	                           var imgURL =  webkitURL.createObjectURL(val.getNative())||URL.createObjectURL(val.getNative());
	                            localImgArr.push({img:imgURL,thumbimg:imgURL});
	                           //localImgArr.push({image:imgURL,thumb:imgURL});
	                        });
	                        if(files.length>5){
	                            utils.showTip('最多只能上传5张照片！');
	                        }
	                       myEvaluateConsume.renderUploadDiv();
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
	                             //var img ={image:info.response.img,thumb:info.response.thumbimg};
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
	            qiniu.finishCallback = finishCallback;
	            qiniu.uploaderObj.start();
	        }//end upload
	    };//end qiniu
	    return{
			'init':init
		};
    }
  )
// var evaluateConsume =(function(){
// 	var user = {},userId = '';
//     var img='',localImgArr = [], imgArr = [], evaluateItemNameText ='',salonId='',itemId='',orderTicketId='',itemCommentId='',satisfyType=1,evaluateContent='',satisfyRemark='',
//     hairStylistId='',stylistListData;
//     var $writeEvaluateContent = $('#writeEvaluateContent'),$releaseEvaluateBtn=$('#releaseEvaluateBtn'),$wordCount = $('#wordCount'),
//     	$verySatistied =$('#verySatistied'),$hasSatistied = $('#hasSatistied'),$notSatistied =$('#notSatistied'),
//     	$notSatisfiedStatusBox=$('#notSatisfiedStatusBox'),$consumeTextarea =$('#consumeTextarea'),$uploadBtn =$('#uploadBtn'),
//     	$stylistListBox = $('#stylistListBox'),$selectStylist=$('#selectStylist'),$coverBg =$('#coverBg'),$scroller =$('#scroller');
//     var flag =true,publishLocked = false;//publishLocked用于发布锁定，避免重复发布
// 	var init = function(){
// 		user =  commonUtils.checkLogin();
// 	    if(user){
// 	        userId = user.userId;
// 	    }
// 	    evaluateItemNameText = commonUtils.getQueryString("evaluateItemName");
//         salonId = commonUtils.getQueryString("salonId");
//         itemId = commonUtils.getQueryString('itemId');
//         orderTicketId =commonUtils.getQueryString('orderTicketId');
//         $('#edbItemName').text(evaluateItemNameText);
//         //初始化评价的数
//         myEvaluateConsume.getEvaluateInitData();
//         //评价的监听
//         myEvaluateConsume.addEvaluateClickListener();
//         //监听评价内容可输入的字数
//         $consumeTextarea.on('input',function(){
//         	var textareaVal = $(this).val(),textareaLen = textareaVal.length;
//         	$wordCount.text(140-textareaLen).removeClass('main-color');
//         	if(textareaLen>=135&&textareaLen<140){
//         		$wordCount.addClass('main-color');
//         	}
//         	else if(textareaLen>=140){
//         		$wordCount.text(0);
//         		$consumeTextarea.val(textareaVal.substring(0,140));
//         	}
//         });    

//         //七牛
//         qiniu.init();
//         //get造型师列表
//         myEvaluateConsume.getStylistListData();	
//         //show造型师列表
//         myEvaluateConsume.selectStylist();

// 	};
// 	var myEvaluateConsume ={
// 		//评价的监听
// 		addEvaluateClickListener:function(){
// 			$('#verySatistied,#hasSatistied,#notSatistied').on('click',function(){
// 				satisfyType = $(this).attr('satisfyType');
// 				$consumeTextarea.val('');
// 				$('.ecbrl-status').siblings('.satisty-num').show();
// 				$(this).addClass('ecbrl-on').attr('data-status','on').parent('li').siblings().find('.ecbrl-status').removeClass('ecbrl-on');
// 				if(stylistListData.length<=0){
// 					$selectStylist.hide();
// 				}
// 			});
// 			//非常满意
// 			//满意
// 			$('#verySatistied,#hasSatistied').on('click',function(){
// 				$releaseEvaluateBtn.addClass('main-color');
// 				$writeEvaluateContent.show();
// 				$notSatisfiedStatusBox.hide();
// 				// $consumeTextarea.val('').attr('placeholder','感谢您对本次服务的认可，记录下您此时的心情吧');
// 				$consumeTextarea.val('').attr('placeholder','非常好的服务，剪发棒棒哒，下次还再来!');
// 			})
// 			//不满意
// 			$notSatistied.on('click',function(){
// 				$writeEvaluateContent.hide();
// 				$notSatisfiedStatusBox.show();
// 				$releaseEvaluateBtn.removeClass('main-color');
// 			});

// 			$releaseEvaluateBtn.on('click',function(){
// 				if(publishLocked){//已锁定发布，不可重复提交
//                     return;
//                 }
// 			    evaluateContent = $consumeTextarea.val();
// 			    if($selectStylist.attr('hairStylistId')){
// 			    	hairStylistId =$selectStylist.attr('hairStylistId');
// 			    }
// 			    else{
// 			    	hairStylistId=='';
// 			    }
// 			    var selectSatistyLen =$('.ecb-result-list li').find('.ecbrl-on').length,
// 			    	selectNotSatistyResultLen = $notSatisfiedStatusBox.find('.not-satistied-current').length;
// 			    if(satisfyType==1){
// 			    	//satisfyRemark='很满意';
// 			    	satisfyType='VERY_SATISFIED';
// 			    }
// 			    else if(satisfyType==2){
// 			    	//satisfyRemark='满意';
// 			    	satisfyType='SATISFIED';
// 			    }
// 			    else if(satisfyType==3){
// 			    	$notSatisfiedStatusBox.find('li').each(function(index, obj) {
// 			        	var _dataStatus = $(obj).attr('data-status');
// 			        	if(_dataStatus=='current'){
// 			        		satisfyRemark= (index+1);
// 			        		console.log(satisfyRemark);
// 			        	}
// 			        });
// 			        switch(satisfyRemark){
// 			        	case 1:
// 			        		satisfyRemark ='UNSATISFIED_SERVICE';
// 			        	break;
// 			        	case 2:
// 			        		satisfyRemark ='UNSATISFIED_HAIRSTYLE';
// 			        	break;
// 			        	case 3:
// 			        		satisfyRemark ='UNSATISFIED_CHARGE';
// 			        	break;
// 			        	default:
// 			        	break;
// 			        }
// 			        satisfyType='UNSATISFIED';
// 			    }
// 			    //选择评价满意度提示
// 			    //if(satisfyType==1||satisfyType==2){
// 			    if(satisfyType=='VERY_SATISFIED'||satisfyType=='SATISFIED'){
// 			    	if(selectSatistyLen>0){
//                         commonUtils.showLoading();
//                         publishLocked = true;
//                         if(localImgArr.length>0){
//                             qiniu.upload(function(){
//                                 myEvaluateConsume.getEvaluateConsumeData.call(myEvaluateConsume);
//                             });
//                         }//有图片需要上传
// 			    		else{
//                             myEvaluateConsume.getEvaluateConsumeData();
//                         }
// 			    	}
// 			    	else{
// 			    		commonUtils.alert('请选择一个评价满意度！');
// 			    	}
// 			    }
// 			    else{
// 			    	if(selectSatistyLen>0&&selectNotSatistyResultLen>0){
//                         commonUtils.showLoading();
//                         publishLocked = true;
// 			    		if(localImgArr.length>0){
//                             qiniu.upload(function(){
//                                 myEvaluateConsume.getEvaluateConsumeData.call(myEvaluateConsume);
//                             });
//                         }//有图片需要上传
//                         else{
//                             myEvaluateConsume.getEvaluateConsumeData();
//                         }
// 			    	}
// 			    	else{
// 			    		commonUtils.alert('请选择一个评价满意度！');
// 			    	}
// 			    }
// 			});
// 		},
// 		getEvaluateInitData:function(){
// 			var data = {to:"commentInit",type:"Order",
// 				body:{
// 					userId:userId,
// 					salonId:salonId,
// 					itemId:itemId
// 				}
// 			}
//         	commonUtils.ajaxRequest({data:data,successCallback:this.getEvaluateInitCallback,url:apiConfig.orderApi});
// 		},
// 		getEvaluateInitCallback :function(data){
// 			if(data.result){
// 				var initEvaluateData = data.data.main,
// 					remarkData = initEvaluateData.remark,
// 					remarkArr = [];
// 				$verySatistied.siblings('.satisty-num').text(initEvaluateData.satisfyOne);
// 				$hasSatistied.siblings('.satisty-num').text(initEvaluateData.satisfyTwo);
// 				$notSatistied.siblings('.satisty-num').text(initEvaluateData.satisfyThree);
// 				$notSatisfiedStatusBox.html('');
// 				for(var i=0;i<remarkData.length;i++){
// 					remarkArr.push('<li>'+remarkData[i]+'</li>');
// 				}
// 				$(remarkArr.join('')).appendTo($notSatisfiedStatusBox);
// 			}
// 			//不满意选项
// 			$('#notSatisfiedStatusBox li').on('click',function(){
// 				$releaseEvaluateBtn.addClass('main-color');
// 				$writeEvaluateContent.show();
// 				$notSatisfiedStatusBox.hide();
// 				//$consumeTextarea.attr('placeholder','写下您不满意的地方吧，我们将督促商家改进');
// 				$(this).addClass('not-satistied-current').attr('data-status','current');
// 			});
// 			$('#saveCheck').on('click',function(){
//                 flag = $(this).attr('flag');
//                 if(flag=='true'){
//                     $(this).find('i').addClass('sh-unselected');
//                     $(this).attr('flag','false');
//                     flag = false;
//                 }
//                 else{
//                     $(this).find('i').removeClass('sh-unselected');
//                     $(this).attr('flag','true');
//                     flag = true;
//                 }
//             });
// 		},
// 		getEvaluateConsumeData:function(){
// 			if(imgArr==''){flag = false;}
// 			var data ={
// 				userId:userId,
// 				orderTicketId:orderTicketId,
// 				itemId:itemId,
// 				salonId:salonId,
// 				hairStylistId:hairStylistId,
// 				satisfyType:satisfyType,
// 				content:evaluateContent,
// 				images:JSON.stringify(imgArr),
// 				satisfyRemark:satisfyRemark,
// 				saveToAlbum:flag
// 			}

// 			commonUtils.request({data:data,successCallback:this.getEvaluateConsumeCallBack,url:apiConfig.newApi+'comment/post-item.html'});
// 		},
// 		getEvaluateConsumeCallBack:function(data){
// 			if(data.code==0){
// 				var evaluateConsumeData = data.response,
// 					commentId = evaluateConsumeData.commentId;
// 				 window.location="evaluateDetail.html?orderTicketId="+orderTicketId+"&commentId="+commentId+"&salonId="+salonId+"&itemId="+itemId;
// 			}
// 			else{
//     			commonUtils.alert(data.message.replace("用户","亲，您"));
//     		}
// 		},
// 		selectStylist :function(){
// 			$selectStylist.on('click',function(){
// 				$coverBg.show().removeClass('opacity-hide').addClass('opacity-show');
// 				$stylistListBox.show().addClass('pull-left').removeClass('pull-right');	
// 				$stylistListBox.on('webkitAnimationEnd animationend',function(){
// 					new IScroll('#stylistListBox', {scrollbars:"",click:true});
// 				});				  		
// 			});
// 			myEvaluateConsume.addStylistListListener();   
// 			$coverBg.on('click',function(){
// 				$coverBg.hide().addClass('opacity-hide').removeClass('opacity-show');
// 				$stylistListBox.removeClass('pull-left').addClass('pull-right');
// 			});
// 		},
// 		getStylistListData:function(){
// 			var data = {to:"index",type:"Stylist",
// 				body:{
// 					userId:userId,
// 					salonId:salonId
// 				}
// 			}
//         	commonUtils.ajaxRequest({data:data,successCallback:function(data){
//         		if(data.result){
//         			    stylistListData = data.data.main,
//         				stylistListDataLen = stylistListData.length,
//         				stylistListArr=[];
//         			for(var i=0;i<stylistListDataLen;i++){
//         				stylistListArr.push('<li hairStylistId='+stylistListData[i].stylistId+'><img onerror="this.src=../../images/user/gerenziliao_touxiang@2x.png" src='+stylistListData[i].stylistImg+'>');
//         				stylistListArr.push('<div class="slb-right"><p class="slbr-name">'+stylistListData[i].stylistName+'</p>');
//         				stylistListArr.push('<p class="slbr-job"><span>'+stylistListData[i].job+'</span><span></span>');
//         				stylistListArr.push('</p></div></li>');
//         			}
//         			$(stylistListArr.join('')).appendTo($scroller);
//         			myEvaluateConsume.addStylistListListener();
//         		}
//         		else{
//         			commonUtils.showTip('网络异常，请稍后再试！');
//         		}
//         	},url:apiConfig.shopApi});
// 		},
// 		addStylistListListener:function(){
// 			$scroller.find('li').on('click',function(){
// 				hairStylistId = $(this).attr('hairStylistId');
// 				$(this).find('img').addClass('stylist-on').end().siblings().find('img').removeClass('stylist-on');	
// 				var stylistName =$(this).find('.slbr-name').text(),
// 					stylistNum =$(this).find('.slbr-job').find('span').eq(0).text(),
// 					stylistJob = $(this).find('.slbr-job').find('span').eq(1).text(),
// 				    stylistStr = stylistName+stylistNum+stylistJob;
// 				// stylistStr='<span class="wecss-text01">'+stylistName+'</span><span class="wecss-text02">'+stylistNum+'</span><span class="wecss-text03">'+stylistJob+'</span>'; 
// 				stylistStr='<span class="wecss-text01">选择设计师：'+stylistName+'</span><span class="wecss-text02">'+stylistNum+'</span><span class="wecss-text03">'+stylistJob+'</span>'; 
// 				$selectStylist.html(stylistStr).attr('hairStylistId',hairStylistId);
// 				$stylistListBox.removeClass('pull-left').addClass('pull-right');
// 				$coverBg.hide().addClass('opacity-hide').removeClass('opacity-show');
// 				setTimeout(function(){
// 					$stylistListBox.hide();
// 					$coverBg.hide();
// 				},300);
// 			});
// 		},
// 	    renderUploadDiv:function(){
// 	        var imgLen = localImgArr.length;
// 	        var imgStr='';
// 	        for(var i=0;i<imgLen;i++){
// 	            if(i < 5){
// 	                var $imgDiv = $("#uploadImgDiv > div").eq(i);
// 	                imgStr = '<div class="img" style="background-image:url('+ localImgArr[i].thumbimg +')" bigImgSrc="'+localImgArr[i].img+'"</div>';
// 	                $imgDiv.html(imgStr);
// 	            }
// 	            else{
// 	                break;
// 	            }
// 	        }
// 	        if(imgLen >= 5){$uploadBtn.hide();}
// 	    }
// 	}

// 	/*
//     *七牛云
//      */
//     var qiniu = {
//         uploaderObj:null,
//         tokenArr:[],
//         fileNum:5,
//         finishCallback:null,
//         init:function(){
//             //start proxy 隐藏状态下不能正确配置上传区域的高和宽，因此proxy
//             var $btn = $("#uploadBtn");
//             $btn.on("click",function(){
//                 $btn.next().find("input[type=file]:eq(0)").click();
//             })
//             //end proxy
//             commonUtils.require({
//                 fileList:["../../libs/plugins/qiniu/plupload.full.min.js","../../libs/plugins/qiniu/qiniu.min.js"],
//                 onFinish:function(){
//                     qiniu.getToken(function(tokenObj){
//                         qiniu.initUploader();
//                     });
                    
//                 }//end onFinish
//             });//end require
//         },//end initUploader
//         getToken:function(cb){
//             commonUtils.request({
//                 data:{userId:user.userId,type:"2",num:"5"},//type2 评论
//                 url:apiConfig.newApi+"/file/qiniu/get-token.html",
//                 async:true,
//                 successCallback:function(data){
//                     qiniu.tokenArr = data.response.data;
//                     if(cb){
//                         cb();
//                     }
//                 }
//             });
//         },//end getToken
//         initUploader:function(){
//             var tokenObj;
//             if(qiniu.tokenArr.length>0){
//                 tokenObj = qiniu.tokenArr.shift();
//             }else{
//                 qiniu.getToken(qiniu.initUploader);
//                 return;
//             }
//             this.uploaderObj = Qiniu.uploader({
//             runtimes: 'html5',    //上传模式,依次退化
//             browse_button: 'uploadBtn',       //上传选择的点选按钮，**必需**
//             domain: apiConfig.qiniuServerApi,   //bucket 域名，下载资源时用到，**必需**
//             max_file_size: tokenObj.maxFileSize+"mb",           //最大文件体积限制
//             filters: {
//               mime_types : [
//                     { title : "Image files", extensions : "jpg,gif,png,jpeg" },
//                   ]
//             },
//             uptoken:tokenObj.uptoken,
//             auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
//             init: {
//                     'FilesAdded': function(up, files) {
//                         $.each(files,function(key,val){
//                             if((qiniu.fileNum--) <= 0){
//                                 localImgArr.shift();
//                             }
//                            var imgURL =  webkitURL.createObjectURL(val.getNative())||URL.createObjectURL(val.getNative());
//                             localImgArr.push({img:imgURL,thumbimg:imgURL});
//                            //localImgArr.push({image:imgURL,thumb:imgURL});
//                         });
//                         if(files.length>5){
//                             commonUtils.showTip('最多只能上传5张照片！');
//                         }
//                        myEvaluateConsume.renderUploadDiv();
//                        qiniu.uploaderObj.refresh();
//                     },
//                     'BeforeUpload': function(up, file) {
//                         up.setOption({
//                             'multipart': true,
//                             'multipart_params': {'token':tokenObj.uptoken}
//                         });
//                         tokenObj = qiniu.tokenArr.shift();
//                     },
//                     'UploadProgress': function(up, file) {
//                     },
//                     'FileUploaded': function(up, file, info) {
//                          if(typeof info === "string"){
//                             info = JSON.parse(info);
//                           }//json-str to json
//                           if(info.response){
//                              var img ={img:info.response.img,thumbimg:info.response.thumbimg};
//                              //var img ={image:info.response.img,thumb:info.response.thumbimg};
//                               imgArr =imgArr.concat(img);
//                           }//check the response 
//                           localImgArr.shift();//上传完毕,从本地列表中删除
//                           if(localImgArr.length == 0){//上传完毕
//                             qiniu.uploaderObj.stop();
//                             qiniu.finishCallback();
//                           }
                          
//                     },
//                     'Error': function(up, err, errTip) {
//                         if(err.message=="File size error."){
//                             commonUtils.alert("文件大小不能超过"+tokenObj.maxFileSize+"mb");
//                         }else{
//                             commonUtils.alert(errTip);
//                         }
//                     },
//                     'UploadComplete': function() {
//                            //队列文件处理完毕后,处理相关的事情
//                     },
//                     'Key': function(up, file) {
//                         // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
//                         // 该配置必须要在 unique_names: false , save_key: false 时才生效,key即为上传文件名
//                         //return tokenObj.fileName
//                     }
//                 }
//             });
            
//         },//end initUploader
//         upload:function(finishCallback){
//             qiniu.finishCallback = finishCallback;
//             qiniu.uploaderObj.start();
//         }//end upload
//     };//end qiniu
//     return{
// 		'Init':init
// 	};
// })();

// evaluateConsume.Init();