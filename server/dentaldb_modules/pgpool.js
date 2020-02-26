const pg = require('pg')

const pool = new pg.Pool({
	user: process.env.USER_DB,
	host: '127.0.0.1',
	database: 'dental_db',
	password: process.env.PASSWORD_DB,
	port: process.env.PORT,
	idleTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

 exports.execute = async function (text, values) {

    let result = undefined

    ;await (async () => {

        const client = await pool.connect()

        try {
            result = await client.query(text,values)
            // console.log(result.rows[0])
        } finally {
            // Make sure to release the client before any error handling,
            // just in case the error handling itself throws an error.
            client.release()
        }
    })().catch(err => console.log(err.stack))

    return await result

};