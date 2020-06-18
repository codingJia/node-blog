const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require('../controller/blog')

// 统一登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    if (req.query.isadmin) {
      const loginCheckRes = loginCheck(req)
      if (loginCheckRes) {
        return loginCheckRes
      }
      author = req.session.username
    }
    const res = getList(author, keyword)
    return res.then((listData) => {
      return new SuccessModel(listData)
    })
  }
  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const res = getDetail(id)
    return res.then((data) => {
      return new SuccessModel(data)
    })
  }
  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckRes = loginCheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }
    req.body.author = req.session.username
    const res = newBlog(req.body)
    return res.then((data) => {
      return new SuccessModel(data)
    })
  }
  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckRes = loginCheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }

    const res = updateBlog(id, req.body)
    return res.then((data) => {
      return data ? new SuccessModel() : new ErrorModel('更新博客失败')
    })
  }
  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckRes = loginCheck(req)
    if (loginCheckRes) {
      return loginCheckRes
    }

    const author = req.session.username
    const res = delBlog(id, author)
    return res.then((delData) => {
      return delData ? new SuccessModel() : new ErrorModel('删除博客失败')
    })
  }
}

module.exports = handleBlogRouter
