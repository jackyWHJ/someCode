define(["jquery", "commonUtils"],
    function($, utils) {
        var user = {},userId = "";
        var $ulbLogin =$("#ulbLogin"),
            $ulbLogged =$('#ulbLogged'),
            $loginUserImg =$('#loginUserImg'),
            $userLoginBox =$('#userLoginBox'),
            $userName=$('#userName'),
            $vipSpan =$('#vipSpan');
        var init= function(){
            user =  JSON.parse(window.sessionStorage.getItem("user")||window.localStorage.getItem("user"));
            if(user){
                userId = user.userId;
            }
            if(userId){
                if(user.img){
                    $loginUserImg.css('background-image','url('+user.img+')');
                }
                else{
                    $loginUserImg.css('background-image','url(../../images/user/gerenziliao_touxiang@2x.png)');
                }
                $userName.text(user.nickname);
                if(user.growth){
                    Grader.setGrade(user.growth,$('#vipSpan'));
                }
                $ulbLogin.hide();
                $ulbLogged.show();
                myCM.getMyCmData();
                $userLoginBox.on("click",function(){
                    window.location = "myAccount.html";
                });
            }
            else{
                $ulbLogged.hide();
                $ulbLogin.show();
                var myPageH =$('#myPage').height();
                $('#unLoginCoverBg').height(myPageH-57).show();
                $userLoginBox.on("click",function(){
                    window.sessionStorage.setItem("location",window.location);
                    window.location = "userLogin.html";
                });
                utils.authorize();
            }
            utils.addBack();
            myCM.addMyCmListener();
        }
        //用户等级
        var Grader = {
            getGrade:function(grade){
                if(grade<5){
                    return ['h',grade+1];
                }else if(grade<10){
                    return ['d',grade%5+1];
                }else{
                    return ['c',grade%5+1];
                }
            },
            //grade 等级 ;$c jq container 展示等级的容器
            setGrade:function(grade,$c){
                var grade = this.getGrade(Number(grade));
                var html =[];
                for(var c = grade[0],i = grade[1] ; i >0 ; i --){
                    html.push("<i class='grade "+ c +"'></i>");
                }
                $c.html(html.join(''));
            }
        }
        var myCM = {
            getMyCmData:function(){
                var data = {userId:userId};
                utils.request({
                    data:data,
                    successCallback:this.getMyCmCallback,
                    url:apiConfig.newApi+"user/my-choumei-v6.html"
                });
            },
            getMyCmCallback:function(data){
                if(data.code == 0){
                    var cmData = data.response;
                    user = $.extend(true,user,cmData);
                    // 更新用户信息
                    window.sessionStorage.setItem("user", JSON.stringify(user));
                    window.localStorage.setItem("user", JSON.stringify(user));

                    $('#balanceMoney').text('￥'+cmData.money);
                    if(cmData.headUrl){
                        $loginUserImg.css('background-image','url('+cmData.headUrl+')');
                    }
                    else{
                        $loginUserImg.css('background-image','url(../../images/user/gerenziliao_touxiang@2x.png)');
                    }
                    $('#userName').text(cmData.nickname);
                    if(cmData.growth != user.growth){
                        Grader.setGrade(cmData.growth,$('#vipSpan'));
                    }
                    var unuseNum = cmData.unUseNum,unEvaluatedNum = cmData.unEvaluatedNum;
                    if(unuseNum>0){
                        $('#unuseNum').show().text(unuseNum);
                    }
                    if(unEvaluatedNum>0){
                        $('#unevaluateNum').show().text(unEvaluatedNum);
                    }
                }
                else{
                    utils.showTip(data.message);
                }
            },
            addMyCmListener:function(){
                 //个人资料
                $('#ulbLogged').on('click',function(){
                    window.location='myAccount.html';
                });
            }
        }
        return{
            'init':init
        }
    }
)
