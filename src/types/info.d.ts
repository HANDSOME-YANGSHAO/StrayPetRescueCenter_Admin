declare namespace INFO {

  interface pagination{
    pageNum: number
    pageSize: number
    total: number
  }

  interface UserInfo {
    userId: string
    nickName: string
    userName: string
    password: string
    age: number
    keptPets: boolean
    phoneNum: string
    email: string
    address: string
    introduction: string
    sex: string
  }

  interface ArticleData {
    articleId: string
    title: string
    avatar: string
    authorName: string
    publishTime: string
    content: string
    hitsNum: number
    replyNum: number
    thumbsUpNum: number
  }

  interface Notice {
    noticeId: string
    title: string
    publishTime: string
    content: string
  }

  interface Expenditure {
    id: string
    publishTime: string
    title: string
    pay: string
    content: string
    imgList: string[]
  }

  interface Income {
    id: string
    publishTime: string
    title: string
    income: string
    content: string
    imgList: string[]
  }

  interface Feedback {
    id: string
    publishTime: string
    content: string
  }
}
