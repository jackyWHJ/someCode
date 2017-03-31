export const API = {
	customTopicDataAPI: "/learn/app/clientapi/home/secondPage.do"
}
export const moduleMap = {
  // 23: {  // 问卷
  //  enable: true,
  //  getRouterUrl(data){
  //    return {
  //      list: 'questionnaire',
  //      detail: 'questionnaire/questionnaireDetails/' + data.sourceId
  //    }
  //  }
  // },
  0: { //课程
    enable: true,
    getRouterUrl(data) {
      return {
        list: '',
        detail: 'classify/courseDetail/' + data.sourceId
      }
    }
  },
  1: {  // 资讯
    enable: true,
    list: 'info/information',
    detail: 'info/information/infoDetail'
  },
  14: { //  必修
    enable: true,
    list: 'courseLearn/14',
    detail: 'courseLearn/14'
  },
  29:{  //  选修
    enable: true,
    list: 'courseLearn/29',
    detail: 'courseLearn/29'
  },
  3:{ //  自定义专题
    enable: true,
    getRouterUrl(data){
      return {
        list: 'customTopic/'+ data.sourceId + '/' + data.realTitle,
        detail: 'customTopic/'+ data.sourceId + '/' + data.realTitle,
      }
    }
  },
  5:{//排行榜
    enable: true,
    list: 'rank',
    detail: 'rank'
  },
  12:{ // 课程专题
    enable: true,
    getRouterUrl(data){
      return {
        list: '/courseSubject',
        detail: '/courseSubject/subjectDetail/' + data.sourceId
      }
    }
  },
  27:{
    enable: true,
    getRouterUrl(data){
      return {
        list: 'classify/mainface',
        detail: 'classify/mainface'
      }
    }
  },
  10:{//考试列表
    enable: true,
    list: 'examMain',
    detail: 'examMain'
  }
};