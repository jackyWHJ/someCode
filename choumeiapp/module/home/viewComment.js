/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-04-24 18:42:44
 * @version $Id$
 */
define(["jquery", "commonUtils", 'libs/plugins/swiper/swiper.min', "jquery.lazyLoad" ], function( $, commonUtils, Swiper ){


//$(function() {

    var page = {
        // id: commonUtils.getQueryString("id"), //店铺/项目id
        salonId:commonUtils.getQueryString('salonId'),
        itemId:commonUtils.getQueryString('itemId'),
        stylistId:commonUtils.getQueryString('stylistId'),
        type: commonUtils.getQueryString("type"), //1店铺 2项目
        satisfyType: commonUtils.getQueryString("satisfyType")||0,
        loadTag:{end:false},
        flag:'true',
        init: function() {
            page.action.init();
            page.view.clickElem();
        }, //end init
        data: {
            cache:{},//for data cache
            rangeKey:Math.random(),//make a different key for cache
            listData: {
                pageNum: 0,
                pageSize: 10,
                data: null,
                load: function(callback) {
                    var url = apiConfig.newApi;
                    var args ={
                        satisfyType:page.satisfyType,
                        contentNotBlank:page.flag,
                        pageNum:++this.pageNum
                    }
                    if(page.salonId){
                        args.salonId = page.salonId;
                        url +='comment/salon.html';
                        $("#satisfyLabel").text("满意度：");
                    }
                    else if(page.itemId){
                        args.itemId = page.itemId;
                        url+='comment/item.html';
                        $("#satisfyLabel").text("满意度：");
                    }
                    else if(page.stylistId){
                        args.stylistId = page.stylistId;
                        url+='comment/stylist.html';
                        $("#satisfyLabel").text("好评度：");
                    }
                    commonUtils.request({
                        data:args,
                        url:url,
                        successCallback:function(data){
                            if(data.code==0){
                                page.data.listData.data = data.response;
                                callback();
                                page.view.init();
                                if(page.data.listData.data.stats.commentNum<args.pageSize){
                                    page.loadTag.end = false;
                                }   
                            }
                            else{
                                commonUtils.showTip(data.message);
                            }
                        }
                    });  
                }
            } //end listData
        }, //end data
        view: {
            init:function(){
                this.initSortList();
                this.swiper.init();
            },//end init
            clickElem:function(){
                $("#vc-sortList").on("click","li",function(){
                    $(this).addClass('active').siblings().removeClass('active');
                    page.satisfyType = $("#vc-sortList li").index($(this));
                    //暂无评论提示
                    $('#noCommentTips').hide();
                    $('#commentList').show();
                    page.action.loadList(true);
                });
                //yes or no content
                $('#sbCheck').on('click',function(){
                    var isContentNotBlank = $(this).attr('contentNotBlank');
                    if(isContentNotBlank=='true'){
                        $(this).find('i').addClass('sbci-unselected');
                        page.flag = 'false';
                        $(this).attr('contentNotBlank','false');
                    }
                    else{
                        $(this).find('i').removeClass('sbci-unselected');
                         page.flag = 'true';
                        $(this).attr('contentNotBlank','true');
                    }
                    page.action.loadList(true);
                });
            },
            initSortList:function(){
                $("#vc-sortList").find("li").eq(page.satisfyType).addClass('active').siblings().removeClass('active');
                var statsData = page.data.listData.data.stats,
                    allSatisfyNum = statsData.commentNum,
                    verySatisfiedNum = statsData.verySatisfiedNum,
                    satisfiedNum = statsData.satisfiedNum,
                    dissatisfiedNum = statsData.unsatisfiedNum,
                    satisfaction = statsData.satisfaction;
                $("#satisfy-all").text(allSatisfyNum);
                $("#satisfy-very").text(verySatisfiedNum);
                $("#satisfy-ok").text(satisfiedNum);
                $("#satisfy-bad").text(dissatisfiedNum);
                $("#satisfactionDegree").text(satisfaction);
                if((page.satisfyType==3&&dissatisfiedNum==0)||(page.satisfyType==2&&satisfiedNum==0)||(page.satisfyType==1&&verySatisfiedNum==0)){
                    $('#noCommentTips').show().find("p").text("暂无此类评价");
                    $('#commentList').hide();
                }

            },//end initSortList
            grader:{
                 getGrade:function(grade){
                    if(grade<5){
                        return ['h',grade+1];
                    }else if(grade<10){
                        return ['d',grade%5+1];
                    }else{
                        return ['c',grade%5+1];
                    }
                },
                //point 分值 ;$c jq container 展示等级的容器
                getGradeStr:function(grade){
                    var grade = this.getGrade(Number(grade));
                    var html =[];
                    for(var c = grade[0],i = grade[1] ; i >0 ; i --){
                        html.push("<i class='grade "+ c +"'></i>");
                    }
                    return html.join('');
                }
            },//end grader
            updateList: function(reset) {
                //var data = page.data.listData.data.appraisalList,
                var commentListData = page.data.listData.data.data,
                    htmlStr = [],list = $("#commentList");
                //console.log(commentListData);
                $.each(commentListData, function(key, val) {
                    htmlStr.push('<div class="vc-cl-commentItem">');
                    htmlStr.push('<div class="vc-cl-content"><div class="vc-cl-head">');
                    val.avatar = (val.avatar)?val.avatar:'../../images/default_img.png';
                    htmlStr.push('<img src="'+val.avatar+'" alt="个人头像" class="vc-cl-headImg"/>');
                    htmlStr.push('<span class="csi">'+val.satisfyType+'</span><span class="vc-cl-tel">'+val.phone+'</span></div>');
                    htmlStr.push('<div class="vc-cl-comment"><p class="vc-cl-commentDesc">'+val.content+'</p>');
                    var imgList = val.images;
                    if(imgList){
                        var dataKey = page.data.rangeKey++;
                        htmlStr.push('<ul class="vc-cl-imgList" datakey ="'+dataKey+'">');
                        var bigImgList = [];
                         $.each(imgList, function(key, val) {
                            htmlStr.push('<li><img src="../../images/default_img.png"  class="vc-cl-img lazy" data-original="'+val.thumb.url+'"/></li>');
                            bigImgList.push(val.image.url);
                         });
                         page.data.cache[dataKey] = bigImgList;
                         htmlStr.push("</ul>");
                    }
                    htmlStr.push('</div>');
                    htmlStr.push('<p class="vc-cl-time">'+val.createTime+'</p>');
                    if(val.reply){
                        htmlStr.push('<p class="vc-cl-reply">'+val.reply+'</p>');
                    }
                    htmlStr.push('</div></div>');
                });
                if(reset){
                    if(commentListData.length==0){
//                       list.html("<div style='text-align:center;font-size:1.2rem;color: #e83260;'>暂无相关评论哟!</div>")
                        $('#noCommentTips').show().find("p").text("暂无有内容的评价");
                        $('#commentList').hide();
                    }else{
                        list.empty();
                        $('#noCommentTips').hide();
                        $('#commentList').show();
                    }
                }
                list.append(htmlStr.join(""));
                $("img.lazy").removeClass("lazy").lazyload({effect:"fadeIn"});
				$('.vc-cl-imgList li').each(function(){
					var $this=$(this);
					$this.height($this.width());
				});
                if(page.data.listData.pageNum==1){

                }
            },//end updateList
            swiper:{
                init:function(){
                    $("#commentList").on("click",".vc-cl-imgList li",function(){
                        var htmlStr = [],swiperContaierWrap = $("#swiper-containerWrap");
                        var data = page.data.cache[$(this).parent().attr("dataKey")];
                        var index = $(this).index();
                        console.dir(data);
                        htmlStr.push("<div class=\"swiper-container full\" id=\"swiper-container\"><div class=\"swiper-wrapper\" id=\"fullSwiper\">");
                        $.each(data, function(key, val) {
                            htmlStr.push("<div class=\"swiper-slide\"><img  src=\"../../images/default_salon.png\" onerror=\"this.src='../../images/default_img.png'\" data-src=\"");
                            htmlStr.push(val);
                            htmlStr.push("\" index = \"" + key);
                            htmlStr.push("\" class=\"swiper-lazy\" /></div>");
                        })
                        htmlStr.push("</div><div class=\"swiper-pagination\"></div></div>")
                        swiperContaierWrap.html(htmlStr.join(""));
                        swiperContaierWrap.show();
                        new Swiper('#swiper-container', {
                            autoplay: false,
                            pagination: '.swiper-pagination',
                            paginationClickable: true,
                            // Disable preloading of all images
                            preloadImages: false,
                            // Enable lazy loading
                            lazyLoading: true,
                            lazyLoadingInPrevNext:true,
                            initialSlide:index
                        });
                        swiperContaierWrap.on("click",function(){
                            swiperContaierWrap.hide();
                        })
                    })//end click
                    
                }//end init

            }//end swiper
        }, //end view
        action:{
            init:function(){
                this.initList();
            },//end init
            initList: function() {
                $(document).on("scroll", scrollItemList);
                function scrollItemList() {
                    var doc = $(document);
                    var winH = $(window).height();
                    if (doc.scrollTop() + winH >= doc.height()) {
                        page.action.loadList(false);
                    }
                    if (page.loadTag.end == true) {
                        doc.off("scroll", scrollItemList);
                    }
                };
                this.loadList(true);
            },//end initList
            loadList:function(reset){
                if(reset){
                    page.data.listData.pageNum = 0;
                }
                page.data.listData.load(function(){
                    page.view.updateList(reset);
                });
                
            }//end loadList
        }
    } //end page

    return{
        init: page.init
    }
//}
    //page.init();

})