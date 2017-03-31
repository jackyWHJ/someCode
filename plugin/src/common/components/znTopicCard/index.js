import React from 'react';

import ZnImage from 'zn-component/znImage';

import "./style/index.scss";

const ZnTopicCard = ( props ) => <div className="toppicCard">
  <span className="toppicCard-icon" style={{'backgroundColor':props.iconColor}}></span>
    <p className="toppicCard-title">{props.recomTitle}</p>
    <p className="toppicCard-des">{props.recomWords}</p>
    <div className="toppicCard-img">
        <ZnImage src={props.recomImg} />
    </div>
</div>

ZnTopicCard.contextTypes = {
	iconColor: React.PropTypes.string,
	recomTitle: React.PropTypes.string,
	recomWords: React.PropTypes.string,
	recomImg: React.PropTypes.string,
};

ZnTopicCard.defaultProps = {
    iconColor: "",
    recomTitle: "",
    recomWords: "",
    recomImg: "",
};

export default ZnTopicCard;