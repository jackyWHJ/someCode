/* 
* @Author: ypl
* @Date:   2015-04-15 14:59:17
* @Last Modified by:   anchen
* @Last Modified time: 2015-07-22 15:14:09
*/
define(["jquery", "commonUtils"],function($, commonUtils) {
    var keywords='';
    var init = function(){
		commonUtils.addBack();
		commonUtils.addMenu();
        removeEventListener();
        addEventListener();
        keywords = window.sessionStorage.getItem("keywords");
		$("#back").on("click", function(e){
                window.location = "salonList.html";
		});
    };

    var showKeyWordsList = function(){
        var str = localStorage.getItem("salonSearchKeywords");
        if(str && JSON.parse(str)){
            $(".select-search-box ul").html("");
            JSON.parse(str).forEach(function(str,index){
                $(".select-search-box ul").append('<li index='+index+'><div>'+str+'</div></li>');
            });
            $(".select-search-box ul > li:first-child").css("background-color","#f2f2f2");
            $(".select-search-box ul > li").on('click',selectKeywords);
        }
    };

    var showClearBtn = function(e){
        $("#keywordsClearBtn").show();
    };

    var clearKeywordsInput = function(e){
        $("#keywordsInput").val("");
        $(e.target).hide();
    };

    var selectKeywords = function(e){
        var target   = $(e.currentTarget);
        var keywords = target.children().text();
        $("#keywordsInput").val(keywords);
        $(".select-search-box ul > li").css("background-color","");
        target.css("background-color","#f2f2f2");
        searchSalon();
    };

    var searchSalon = function(){
        var searchKeywords = $("#keywordsInput").val(),
            searchKeywords =searchKeywords.replace(/\s+/g,"");
        if(searchKeywords!=''){
            window.sessionStorage.setItem("keywords",searchKeywords);
            saveKeywords(searchKeywords);
            location.href = "searchResult.html?keyword="+searchKeywords;
        }
        else{
            commonUtils.alert('请输入搜索条件！');
        }
    };

    var saveKeywords = function(keywords){
        if(keywords){
            var str = localStorage.getItem("salonSearchKeywords");
            if(str){
                var arr = JSON.parse(str);
                //去除重复数据start
                var index = arr.indexOf(keywords);
                if(index >= 0){arr.splice(index,1);}
                //end
                var length = arr.unshift(keywords)
                if(length>5){
                    arr.splice(5);
                    localStorage.setItem("salonSearchKeywords",JSON.stringify(arr));
                }else{
                    localStorage.setItem("salonSearchKeywords",JSON.stringify(arr));
                }
            }else{
                var arr = new Array(keywords);
                localStorage.setItem("salonSearchKeywords",JSON.stringify(arr));
            }
        }
    };

    var addEventListener = function (){
        $("#keywordsInput").on('focus',showKeyWordsList);
        $("#keywordsInput").on('input',showClearBtn);
        $("#keywordsClearBtn").on('click',clearKeywordsInput);
        $("#searchSalonBtn").on('click',searchSalon);
    };

    var removeEventListener = function (){
        $("#keywordsInput").off();
        $("#keywordsClearBtn").off();
        $("#searchSalonBtn").off();
        $(".select-search-box ul > li").off();
    }

    return {'init':init};
});

