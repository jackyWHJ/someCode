import React from 'react';
import createContainer from 'zn-container';
import { Button} from 'antd-mobile';
import com_default from 'zn-image/examImg/com_default.png';

const PostsContent = React.createClass({
    render(){
        return (
            <div className="posts-content">
                <div className="posts-content-top">
                    <div className="posts-content-title">
                        <img className="posts-content-title-img" src={com_default}/>
                        <div className="posts-content-title-text">
                            <p className="posts-content-title-name">洪祥</p>
                            <p className="posts-content-title-show">特工郭德纲的广告高规格的郭德纲</p>
                        </div>
                        <div className="posts-content-title-time">
                            <p>3-7</p>
                        </div>
                    </div>
                    <div className="posts-content-text">
                        <article>回电话多喝点和接受电话的快速快递电话等级硕士生计算机等级的基督教说什么时间的点击计算机四季度</article>
                    </div>
                </div>
                <div className="posts-content-middle"></div>
                <div className="posts-content-bottom"></div>
            </div>
        );
    }
});

export default PostsContent;