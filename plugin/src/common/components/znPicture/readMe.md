//目录
src\common\components\znPicture


//引入方式如：
import ZnPicture from 'zn-component/znPicture'

//参数如下 （必填参数：imgsSrc，其余都是选填）
{
    imgsSrc:[],     //图片源

    imgsName:[],    //与图片源对应的图片名称
    stClass:"",   //静态展示类名
    dyClass:"",     //动态展示类名
    dyWidth:0,          //动态显示的大小
    dyHeight:0,
    dyBackgroundColor:"#f1f1f1",    //动态显示图片时背景颜色
    stWidth:0,  //静态显示的大小
    stHeight:0,
    infinite:true, //是否循环播放图片
    columnNum:2,    //静态显示图片时每行显示的列数
    hasLine:false,   //静态显示图片时是否显示边线
}
 //具体使用
<ZnPicture imgsSrc={this.state.imgs}/>