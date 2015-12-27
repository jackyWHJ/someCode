/**
 * Created by zhaoheng on 2015/6/25 11:22.
 * Last Modified by zhaoheng on 2015/6/25 11:22.
 */
var result = {}, d = "";
var current = 0,begin = 0, final = 0;
var msGet = function( nowTime, finalTime  ){

    var h = m = s = 0;

    var time = parseFloat( finalTime - nowTime ) / 1000;

    //console.log( "time : " + time );

    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            m = parseInt(time / 60.0);
            s = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            h = parseInt(time / 3600.0);
            m = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
            s = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
        }
        else {
            h = parseInt(time / 3600.0);
            m = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
            s = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
        }
    }

    return {
        h: h,
        m: m,
        s: s,
        currentTime: current,
        end: false
    }

};

onmessage =function (evt){
    //获取到的数据发送会主线程
    d = evt.data;
    //console.log( "获取到的主线程数据 : " + d );
    d = d.split( " " );
    current = parseFloat( d[0] );
    begin =  parseFloat( d[1] );
    final = parseFloat( d[2] );
    timedCount();
}

function DayNumOfMonth(Year,Month) {
    var dStr = Year + "-" + Month;//2010-03-11
    var year = dStr.substring(0,4);     //年
    var month= dStr.substring(5,7);     //月
    var d = new Date(year, month, 0);   //Wed Mar 31 00:00:00 UTC+0800 2010
    return d.getDate();
}

function timedCount() {

    //console.log( "current: " + new Date( current).toLocaleString() );

    current += 1 * 1000;

    var curr = new Date( current ).getHours();

    if( curr >= 0 && current <= begin ){
        result = msGet( current, begin);
    }else if( current > begin && current <= final ){
        result = msGet( current, final );
    }

    //if( current >= new Date( year + "/" + mon + "/" + day + " 23:59:59").getTime()  ){
    //    console.log( "one" );
    //    if( day < DayNumOfMonth( year, mon ) ){
    //        current = new Date( year + "/" + mon + "/" + ( day + 1 ) + " 00:00:00").getTime();
    //    }else{
    //        if( mon < 11 ){
    //            current = new Date( year + "/" + ( mon + 1 )+ "/" + ( 0 ) + " 00:00:00").getTime();
    //        }else{
    //            current = new Date( ( year + 1 )+ "/" + ( 0 )+ "/" + ( 0 ) + " 00:00:00").getTime();
    //        }
    //
    //    }
    //
    //}

    if( current <= final ){
        postMessage( JSON.stringify( result ) );
    }else{
        postMessage( JSON.stringify( { currentTime: current, end: true }))
    }
    setTimeout(function(){
        timedCount();
    }, 1000 );
}

