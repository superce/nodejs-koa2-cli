const route = require('koa-router')
const { query } = require('../mysql/index')
let router = new route()


async function selectAllData() {
  let sql = 'SELECT * FROM plat_shop_datas'
  let dataList = await query(sql)
  return dataList
}

async function deleteShop(id){
  let sql = `DELETE FROM plat_shop_datas where id='${id}'`
  let deleteList = await query(sql,id)
  return deleteList
}

async function updata(params){
  let id = params.id
  let name = params.shop_name
  let sql = `UPDATE plat_shop_datas SET shop_name = '${name}' WHERE id = '${id}' `
  let update = await query(sql,params)
  return update
}

router.get('/list', async (ctx, next) => {
  let name = []
  await selectAllData().then(res =>{
    res.forEach(item =>{
      if(item.type===1&&item.total_fee===0){
        name.push(item)
      }
    })
    ctx.body = {
      code:200,
      msg:'成功',
      data:name  
    }
  }).catch(err =>{
    ctx.body = {
      code:200,
      msg:err,
      data:name  
    }
  })
})

router.post('/delete_shop',async (ctx,next)=>{
  let id= ctx.request.body;
  let result = false
  await selectAllData().then(res =>{
    res.forEach(item =>{
      if(id.id===item.id){
        result = true
      }
    })
  })
  if(result){
    await deleteShop(id.id).then(res =>{
      ctx.body = {
        code:200,
        msg:'成功',
        state:true
      }
    }).catch(err =>{
      ctx.body={
        code:500,
        msg:'失败',
        state:false
      }
    })
  }else{
    ctx.body={
      code:200,
      msg:'没有此数据',
      state:false
    }
  }
})

router.post('/updata',async (ctx,next)=>{
  let name = ctx.request.body
  let result = false
  if(!name.shop_name){
    ctx.body = {
      code:200,
      msg:'空值',
      state:false
    }
    return false
  }
  await selectAllData().then(res =>{
    res.forEach(item =>{
      if(name.shop_name===item.shop_name){
        console.log(item.shop_name)
        result = true
      }
    })
  })
  
  if(result){
    ctx.body = {
      code:200,
      msg:'重复',
      state:false
    }
  }else{
    await updata(name).then(res =>{
      ctx.body = {
        code:200,
        msg:'成功',
        state:true
      }
    }).catch(err =>{
      ctx.body = {
        code:500,
        msg:'错误'
      }
    })
  }
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  // await ctx.render()
  ctx.body = {
    title: 'koa2 json',
    li:'546'
  }
})

module.exports = router

