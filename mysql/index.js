const mysql = require('mysql')
const pool = mysql.createPool({
  host:'localhost',
  user:'root',
  password:'root',
  database:'benji',
  port:'3306'
})

let query = function( sql, values ) {
  // console.log(values)
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }