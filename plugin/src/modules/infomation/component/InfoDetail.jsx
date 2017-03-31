import React from 'react';
import { RefreshControl, ListView } from 'antd-mobile';
import {CONST} from 'zn-common/constants';

import Iframe from 'zn-component/iframe';

const InfoDetail = React.createClass({
    componentDidMount(){
    },

    render() {
        const _self = this;
        var dpr = Util.getDeviceDPR();      
        let fHeight = document.documentElement.clientHeight-CONST.NAVBAR_HEIGHT*dpr;
        return (
            <div style={{overflow:"hidden",height:fHeight}}><Iframe src={this.props.url} style={{height:fHeight}}></Iframe></div>
        );
  },
});

export default InfoDetail;

