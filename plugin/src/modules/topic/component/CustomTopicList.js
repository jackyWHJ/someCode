import React from 'react';
import ZnTopicCard from 'zn-component/znTopicCard';

const CustomTopicList = (props) => {
    const secondArr = props.secondArr?props.secondArr:{
        sourceId:"",
        recomTitle:"",
        recomWords:"",
        recomImg:"",
    };
    return (
        <div> {
            secondArr.map(item => <div key={item.sourceId}  
                onClick={props.goToLink.bind(null,item)}>
            <ZnTopicCard recomTitle={item.recomTitle} 
                recomWords={item.recomWords} 
                recomImg={item.recomImg}
                iconColor={props.iconColor} />
            </div>)
        } </div>
    )
};

export default CustomTopicList;