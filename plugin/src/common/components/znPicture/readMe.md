//Ŀ¼
src\common\components\znPicture


//���뷽ʽ�磺
import ZnPicture from 'zn-component/znPicture'

//�������� �����������imgsSrc�����඼��ѡ�
{
    imgsSrc:[],     //ͼƬԴ

    imgsName:[],    //��ͼƬԴ��Ӧ��ͼƬ����
    stClass:"",   //��̬չʾ����
    dyClass:"",     //��̬չʾ����
    dyWidth:0,          //��̬��ʾ�Ĵ�С
    dyHeight:0,
    dyBackgroundColor:"#f1f1f1",    //��̬��ʾͼƬʱ������ɫ
    stWidth:0,  //��̬��ʾ�Ĵ�С
    stHeight:0,
    infinite:true, //�Ƿ�ѭ������ͼƬ
    columnNum:2,    //��̬��ʾͼƬʱÿ����ʾ������
    hasLine:false,   //��̬��ʾͼƬʱ�Ƿ���ʾ����
}
 //����ʹ��
<ZnPicture imgsSrc={this.state.imgs}/>