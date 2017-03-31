import React from 'react';
import {Link} from 'react-router';
import createContainer from 'zn-container';
import { ListView,WhiteSpace ,RefreshControl,Toast} from 'antd-mobile';
import ZnListItem from 'zn-component/znListItem';
import ZnNoResultTip from 'zn-component/znNoResultTip';
import icon_next2 from 'zn-image/examImg/icon_next2.png';
import * as actions from '../action/ExamListAction';

const PropTypes = React.PropTypes;
const ExamList = React.createClass({
    propTypes: {
        pageSize:PropTypes.number,
        initialListSize:PropTypes.number,
        scrollRenderAheadDistance:PropTypes.number,
        scrollEventThrottle:PropTypes.number,
        onEndReachedThreshold:PropTypes.number,
        data:PropTypes.array,
    },
    getDefaultProps(){
        return {
            pageSize:6,
            initialListSize:6,
            scrollRenderAheadDistance:100,
            scrollEventThrottle:10,
            onEndReachedThreshold:10,
            data:[],
        }
    },
    getInitialState() {
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => {
                return row1 !== row2;
            },
        });
        this.pageIndex = 1;
        this.pageSize = this.props.pageSize;
        this.dataBlob = [];
        return {
            dataSource: dataSource.cloneWithRows([]),
            isLoading: false,
            refreshing: false,
        };
    },
    componentWillReceiveProps(nextProps){
        if(this.props.data!=nextProps.data&&nextProps.data){
            this.addData(nextProps.data);
            this.setState({isLoading: false,refreshing: false});
        }
    },
    addData(data){
        const that = this;
        if(data){
            if(this.pageIndex==1){
                this.dataBlob=[];
            }
            for (let i = 0; i < data.length; i++) {
                const num=(this.pageIndex-1)*this.pageSize+i;
                this.dataBlob[num] = data[i];
            }
            that.setState({
                dataSource: that.state.dataSource.cloneWithRows(this.dataBlob),
            });
        }
    },
    onRefresh() {
        this.setState({ refreshing: true });
        setTimeout(() => {
            this.pageIndex=1;
            if(this.props.onRefresh){
                this.props.onRefresh(this.pageIndex,this.pageSize);
            }
        }, 1000);
    },
    onEndReached(event) {
        if(event){
            if(!this.state.isLoading){
                console.log('reach end', event,'loading:',this.state.isLoading);
                setTimeout(() => {
                    this.pageIndex+=1;
                    if(this.props.onEndReached){
                        this.props.onEndReached(this.pageIndex,this.pageSize);
                    }
                }, 1000);
            }
            this.setState({ isLoading: true });
        }
    },
    MyBody(props){
        return (
            <div className="am-list-body my-body">
                {props.children}
            </div>
        );
    },
    row(rowData, sectionID, rowID){
        return (
            <div key={rowData.examId} className="row-div" onClick={(e)=>{e.stopPropagation();return false;}}>
                <div className="row-flex">
                    <img className="row-img" src={rowData.img} />
                    <div className="row-text">
                        <p className="row-text-p" >{rowData.examName}</p>
                        <Link className="row-text-link" to={'/examMain/examIntroduction/'+rowData.examId+'/'+this.props.type}>
                            <img className="row-text-img" src={icon_next2} />
                        </Link>
                        </div>
                </div>
            </div>
        );
    },
    render() {
        const {onEndReached,onRefresh,content,...other} = this.props;
        return this.dataBlob.length>0?(
            <div className="list-wrap">
                <ListView ref="lv"
                    dataSource={this.state.dataSource}
                    renderFooter={() => {return (this.state.isLoading?(<div style={{ padding: '0.3rem', textAlign: 'center' }}>
                        正在加载...
                    </div>):null);}}
                    renderBodyComponent={()=><this.MyBody />}
                    renderRow={this.row}
                    renderSeparator={(sectionID, rowID)=><WhiteSpace key={`${sectionID}-${rowID}`} size="md" />}
                    className="fortest"
                    style={{height: document.documentElement.clientHeight-43.5*Util.getDeviceDPR()-45*Util.getDeviceDPR(),}}
                    initialListSize={this.props.initialListSize}
                    pageSize={this.props.pageSize}
                    scrollRenderAheadDistance={this.props.scrollRenderAheadDistance}
                    scrollEventThrottle={this.props.scrollEventThrottle}
                    onScroll={() => { }}
                    onEndReached={this.onEndReached}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                    {...other}
                />
            </div>):(<ZnNoResultTip content={this.props.content} />);
    },
    componentWillUnmount(){
        this.props.saveDataSource(this.dataBlob);
    }
});

export default ExamList;