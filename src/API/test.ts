import myRequest from '../utils/request'

const API = {
  category: '/cats/lv2/statistics' // 小说分类
}

const HTTP = {
  getCategory (): any {
    return myRequest({
      url: API.category,
      method: 'GET'
    })
  }
}

export default HTTP
