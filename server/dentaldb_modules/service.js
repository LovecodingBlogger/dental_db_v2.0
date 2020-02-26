const axios = require('axios');
const token = require('./accessToken');
const pg_pool = require('./pgpool');

const retrieveData = async (req, res) => {

    const text = `SELECT "BDMSItemCode" AS "service_id","BDMSItemDesc" AS "service","BDMSTimeInMinute" FROM "Service";`
    const values = []
    
    let myObj 
    ;await (async () => {
        let results = await pg_pool.execute(text,values)
        myObj = await {
            services: results.rows
        }
        res.status(200).json(myObj)
        //console.log(myObj)
    })().catch(err => {
        res.status(501).send({})
        //myObj = err.stack
        //console.log(err.stack)
    })
    return myObj

}

const getService = async () => {

    //get token
    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)

    axios.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN.access_token 
    
    let response = undefined
    try {
        response = await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/GetServiceByLocationCode?input1=01DEN')
    } catch (error) {
        console.log(error)
    }

    const promises = response.data.map(elem => {
        const text = `INSERT INTO public."Service"(
            "BDMSItemCode", "BDMSItemDesc", "BDMSOrderSetCode", "BDMSOrderSetDesc", "BDMSTimeInMinute")
            VALUES ($1, $2, $3, $4, $5);`
        const values = [
            elem.BDMSItemCode,
            elem.BDMSItemDesc,
            elem.BDMSOrderSetCode,
            elem.BDMSOrderSetDesc,
            elem.BDMSTimeInMinute
        ]
    
        ;(async () => {
            await pg_pool.execute(text,values)
        })().catch(err => {
            console.log(err.stack)
        })
    });
    
    await Promise.all(promises);

}

const deleteService = async () => {

    const text = `DELETE FROM public."Service";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
    })().catch(err => {
        console.log(err.stack)
    })

}

module.exports = {
    retrieveData,
    getService,
    deleteService
}
