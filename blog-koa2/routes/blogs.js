const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  if (ctx.query.isadmin) {
    if (ctx.session.username == null) {
      ctx.body = new ErrorModel('未登录')
      return
    }
    author = ctx.session.username
  }
  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const data = await updateBlog(ctx.query.id, ctx.request.body)
  ctx.body = data ? new SuccessModel() : new ErrorModel('更新博客失败')
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const delData = await delBlog(ctx.queryid, author)
  ctx.body = delData ? new SuccessModel() : new ErrorModel('删除博客失败')
})

module.exports = router
