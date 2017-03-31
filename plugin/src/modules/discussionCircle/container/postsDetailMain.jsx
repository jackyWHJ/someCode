import React from 'react';
import createContainer from 'zn-container';
import { Button} from 'antd-mobile';
import ZnNavBar from 'zn-component/znNavBar';
import PostsContent from '../component/posts/postsContent';
import "../style/postsDetailMain.scss";

const PostsDetailMain = React.createClass({
    render(){
        return (
            <div className="posts-detail-main">
                <ZnNavBar />
                <PostsContent />
            </div>
        );
    }
});

export default PostsDetailMain;