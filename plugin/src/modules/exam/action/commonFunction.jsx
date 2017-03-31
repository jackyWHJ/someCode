export const isRight = (chooseAnswer,rightAnswer)=>{
    let array = [];
    for(let i=0;i<rightAnswer.length;i++){
        if(rightAnswer[i].isCorrect=='Y'){
            array.push(rightAnswer[i].sectionId);
        }
    }
    return chooseAnswer.join('')==array.join('');
};
export const checkedAnswerList = (answerList=[],examArray=[],passScore=0)=>{
    //let array = [];
    let blankQuestionIds = '';
    let detail = '';
    let score = 0;
    let total = 0;
    let status = '';
    let list = answerList.slice(0);
    const examArr = examArray;
    for(let i = 0;i<examArr.length;i++){
        total += examArr[i].score;
        if(!list[i]){
            blankQuestionIds += examArr[i].questionId+',';
            continue;
        }
        let array = [];
        list[i].selectedSectionId.forEach((item)=>{
             if(item){
                array.push(item);
             }
        });
        if(isRight(array,examArr[i].sectionArr)){
            score += examArr[i].score;
        }else{
            detail += list[i].questionId + ":" + array + "|";
        }
    }
    score >= passScore ? status = 'Y':status = 'N';
    if(detail && detail.length > 0) {
        detail = detail.substr(0,detail.length -1);
    }
    if(blankQuestionIds && blankQuestionIds.length > 0) {
        blankQuestionIds = blankQuestionIds.substr(0,blankQuestionIds.length -1);
    }
    return {blankQuestionIds,detail,score,total,status};
};
