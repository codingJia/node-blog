const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
  // 1=1相当于筛选的占位符
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return await exec(sql)
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  const author = escape(blogData.author)
  const createtime = Date.now()

  const sql = `
    insert into blogs (title,content,createtime,author)
    values (${title},${content},${createtime},${author})
  `
  const inserData = await exec(sql)
  return {
    id: inserData.insertId,
  }
 
}

const updateBlog = async (id, blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))

  const sql = `
    update blogs set title=${title}, content=${content} where id=${id}
  `
  const updateData = await exec(sql)
  return updateData.affectedRows > 0 ? true : false
}

const delBlog = async (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`
  const delData = await exec(sql)
  return delData.affectedRows > 0 ? true : false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}
