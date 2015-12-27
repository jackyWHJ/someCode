var scratch =(function(){
    var winH = $(window).height(),winW = $(window).width();
    var $lock =$('#lock'),$scratchBox =$('#scratchBox'),$scratchImg=$('#scratchImg'),$getTicketProcess =$('#getTicketProcess'),$coverBg =$('#coverBg'),
        $shareBtn =$('.btn-share'),$scratchCanvas = $("#scratchCanvas"),$winBox =$('#winBox'),$loseBox =$('#loseBox'),
        $noChanceBox=$('#noChanceBox'),$btnGetTicket =$('#btnGetTicket'),$getTicketProcess =$('#getTicketProcess'),
        $gtpImg =$('#gtpImg');
    var myCanvas = document.getElementById('scratchCanvas');
    var sessionRandom='';
	var init = function(){
        preloadImg();
        resizeElem();
        scrathCanvas();
        orientationChange(); 
	}
    var resizeElem = function(){
        var bgH =winW*1.36;
        $('.scratch-box,.sb-bg').height(bgH);
        var statusW = 0.69*winW,statusH =0.4*statusW;
        $scratchImg.css({
            'width':statusW,
            'height':statusH,
            'bottom':0.075*winH
        });
        $gtpImg.height(0.35*winW);
        $shareBtn.on('click',function(event){
            event.stopPropagation();
            $coverBg.show();
            $('#shareTips').show();
            $(this).parent('.result-box').hide();
        });
        $coverBg.on('click',function(){
            $(this).hide();
            $(this).children().hide();
        }); 
        if(window.localStorage.getItem("sessionRandom")){
            sessionRandom= window.localStorage.getItem("sessionRandom");
            if(sessionRandom==1){
                $coverBg.show();
                $noChanceBox.show();
                $coverBg.unbind('click');
            }
        }
    }
    var orientationChange = function(){
        var need_watch = !('onorientationchange' in window);//需要通过resize来检查横竖屏
        if (!need_watch) {
            window.addEventListener("orientationchange", function () {
                if (window.orientation != 0) {
                    $lock.show();
                } else {
                    $lock.hide();
                }
            }, false);
            if (window.orientation != 0) {
                $lock.show();
            }
        }
    }
    var preloadImg = function(){
        commonUtils.loaderImg({
            data:[
                '../../../images/activity/scratchCard/bg.jpg','../../../images/activity/scratchCard/scratch_wrap.png',
                '../../../images/activity/scratchCard/scratch_mask.png','../../../images/activity/scratchCard/scratch_win.png',
                '../../../images/activity/scratchCard/scratch_lose.png','../../../images/activity/scratchCard/result_win.png',
                '../../../images/activity/scratchCard/result_lose.png','../../../images/activity/scratchCard/result_nochance.png',
                '../../../images/activity/scratchCard/btn_get_ticket.png','../../../images/activity/scratchCard/btn_share1.png',
                '../../../images/activity/scratchCard/btn_share2.png','../../../images/activity/scratchCard/btn_share3.png',
                '../../../images/activity/scratchCard/btn_download.png','../../../images/activity/scratchCard/share_tips.png',
                '../../../images/activity/scratchCard/process.png','../../../images/activity/scratchCard/process_img.jpg',
                '../../../images/activity/scratchCard/share_img.png','../../../images/activity/scratchCard/phone_147x219.png'
            ],
            onProgress:function(percent){
                $('#loadingTips').text(parseInt(percent*100)+'%');
            },
            onFinish:function(){
                setTimeout(function(){
                    $('#loadingBox').hide();
                    $('#scratchCardBox').show();
                },500); 
            }
        })
    }
    var windowToCanvas = function(x, y) {  //当canvas不在正常文档流中的时候，需要转换下
        var bbox = myCanvas.getBoundingClientRect();
        return { x: x - bbox.left * (myCanvas.width  / bbox.width),
            y: y - bbox.top  * (myCanvas.height / bbox.height)
        }
    };
    var scrathCanvas = function(){
        var ctx = myCanvas.getContext('2d');
            myCanvas.width = $('#scratchImg').width();
            myCanvas.height = $('#scratchImg').height();
        var img = new Image();
            img.src = '../../../images/activity/scratchCard/scratch_mask.png'; 
        img.onload = function() {
            ctx.drawImage(img, 0, 0, myCanvas.width,myCanvas.height);
            ctx.globalCompositeOperation="destination-out";
            randomVal = Math.floor(Math.random()*2);
            if((sessionRandom!='')&&(sessionRandom==0)||sessionRandom==1){
                randomVal=1;
            }
            myCanvas.addEventListener('touchmove', function(e){
                window.localStorage.setItem("sessionRandom",randomVal);
                randomVal==0 ?$scratchImg.removeClass('simg-win').addClass('simg-lose'):$scratchImg.removeClass('simg-lose').addClass('simg-win');
                e.preventDefault();
                var loc = windowToCanvas(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
                ctx.beginPath();
                ctx.fillStyle = "#f00";
                ctx.arc(loc.x, loc.y, 20, 0, Math.PI*2);
                ctx.fill();
                ctx.closePath();
            });
            myCanvas.addEventListener('touchend', function(e){
                e.preventDefault();
                var num = 0;
                var datas = ctx.getImageData(0,0,myCanvas.width,myCanvas.height);
                for (var i = 0; i < datas.data.length; i++) {
                    if (datas.data[i] == 0) {
                        num++;
                    };
                };
                if (num >= datas.data.length * 0.5) {
                    ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
                    getResult();
                }
            });
        }
    }
    var getResult = function(){
        $coverBg.show();
        if(randomVal==0){
            $loseBox.show();
        }
        else{
            $winBox.show();
            $btnGetTicket.on('click',function(){
                var documentH =$('#gtpContent').height()+$gtpImg.height();
                console.log(documentH);
                if(documentH<winH){
                    $getTicketProcess.css({
                        'position':'absolute'
                    });
                }
                $scratchBox.hide();
                $getTicketProcess.show();
                
            });
        }
    }
	return {
		'Init':init
	}
})();
scratch.Init();