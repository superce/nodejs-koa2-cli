const route = require('koa-router')
const { query } = require('../mysql/index')
const {guid} = require('../guid/index')
const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))

let router = new route()

async function selectAllData() {
    let sql = `SELECT * FROM html`
    let dataList = await query(sql)
    return Promise.resolve(dataList)
  }
async function addInsert(params){
    let title = params.title
    let href = params.href
    let id = guid()
    let sql = `insert into html (id,title,href) values ("${id}","${title}","${href}")`
    let addInsert = await query(sql,params)
    return Promise.resolve(addInsert) 
}
let arr = []
let cont = false
async function savePost(){
    let url = 'https://news.baidu.com/'
    superagent.get(url).charset('utf-8').buffer(true).end((err,res)=>{
        let html = res.text
        let $ = cheerio.load(html,{
            decodeEntities:false,
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false
        })
        $('.baijia-focus-list ul.ulist.bdlist li').each(async (index,item)=>{
            let obj = {
                title:'',
                href:''
            }
            let t = $(item).find('a').text()
            let h = $(item).find('a').attr('href')
            obj={
                title:t,
                href:h
            }
            // await addInsert(obj)
            arr.push(obj)
        })
        cont = true
    })
}
router.get('/html',async (ctx,next)=>{
    savePost()
    await ctx.render('index',{
        arr
    })
})

module.exports = router

