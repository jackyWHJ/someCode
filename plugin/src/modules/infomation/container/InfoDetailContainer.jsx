import React from 'react';
import createContainer from 'zn-container';
import InfoDetail from '../component/InfoDetail';
import ZnNavBar from 'zn-component/znNavBar';
import '../style/information.scss';

const InfoDetailContainer = React.createClass({


    render() {

       //let url = this.props.params.url || 'http://www.zhi-niao.com';
       let url = this.props.location.state.resourceLink || 'http://www.zhi-niao.com';
       return (
            <div className="m-info-det">
                <ZnNavBar >资讯详情</ZnNavBar > 
                <InfoDetail url={url} />
            </div>
        )
    }
});

export default createContainer("infodetail.main", {}, {
    data:[],
    loading: true
}).bind(InfoDetailContainer);