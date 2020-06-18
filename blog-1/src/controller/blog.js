const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
  // 1=1相当于筛选的占位符
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return exec(sql)
}

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then((rows) => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  const author = escape(blogData.author)
  const createtime = Date.now()

  const sql = `
    insert into blogs (title,content,createtime,author)
    values (${title},${content},${createtime},${author})
  `
  return exec(sql).then((inserData) => {
    return {
      id: inserData.insertId,
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))

  const sql = `
    update blogs set title=${title}, content=${content} where id=${id}
  `
  return exec(sql).then((updateData) => {
    console.log('updateData', updateData)
    return updateData.affectedRows > 0 ? true : false
  })
}

const delBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  return exec(sql).then((delData) => {
    return delData.affectedRows > 0 ? true : false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}
