
(function(){
   var init = function(){
        addPageListener();
    };//end init
    var addPageListener = function(){
        var btn = document.getElementById("appBtn");
        btn.onclick = function(){
            window.location = "http://choumeiApp?page=homePage";
        };
        var ruleBtn = document.getElementById("ruleBtn");
        if(ruleBtn){
            ruleBtn.onclick = function(){
                window.location = "jgyg.html";
            };
        }
    };
    init();
})();