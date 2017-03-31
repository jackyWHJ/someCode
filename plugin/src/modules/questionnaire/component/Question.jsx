import React from 'react';


const Question = React.createClass({

	render() {


		var content, index=this.props.index, _this=this;

		switch(this.props.questionType){
			case "1":
				content = <div className="questionnaire-question-type">
							
							{
								this.props.sectionArr.map(function(item, itemIndex){
									return (
										<div className="questionnaire-question-item" key={item.sectionId}>
											<a href="javascript:;" className={"radio-item " + (item.isUserSelected=="Y"?"checked":"")} onClick={()=>_this.props.radioChange(index, item, itemIndex)}>{item.sectionText}</a>
										</div>
									)
								})
							}

							

						</div>
				break;
			case "2":
				content = <div className="questionnaire-question-type">

							{
								this.props.sectionArr.map(function(item, itemIndex){
									return (
										<div className="questionnaire-question-item" key={item.sectionId}>
											<a href="javascript:;" className={"checkbox-item " + (item.isUserSelected=="Y"?"checked":"")} onClick={()=>_this.props.radioChange(index, item, itemIndex)}>{item.sectionText}</a>
										</div>
									)
								})
							}

						</div>
				break;
			case "3":
				content = <div className="questionnaire-question-type questionnaire-question-simple">
							{
								this.props.sectionArr.map(function(item, itemIndex){
									return (
										<div key={itemIndex}>{_this.props.data.tested=="1"?<p>{item.sectionText}</p>:<textarea placeholder="100字以内" maxLength="100" value={item.sectionText} onChange={(event)=>_this.props.textareaChange(event, index, item, itemIndex)}></textarea>}</div>
									)
								})
							}
							
						</div>
				break;
			case "4":
				content = <div className="questionnaire-question-type questionnaire-question-multi">
							{
								this.props.sectionArr.map(function(item, itemIndex){
									return (
										<div key={itemIndex}>{_this.props.data.tested=="1"?<p>{item.sectionText}</p>:<textarea placeholder="800字以内" maxLength="800" value={item.sectionText} onChange={(event)=>_this.props.textareaChange(event, index, item, itemIndex)}></textarea>}</div>
									)
								})
							}
						</div>
				break;
			default:
				break;
		}

		return (
			<div className="questionnaire-question-content">
				<h2>{(this.props.index+1) + "、" + this.props.question}</h2>
				{content}
			</div>
		)

		
	}
});

export default Question