const axios = require('axios');
const token = require('./accessToken');
const pg_pool = require('./pgpool');

let dataInMem = []
const loadDataInMem = async (req, res) => {
    res.status(200).json(dataInMem)
}

const retrieveDataTest = async (req, res) => {
    
    const text = `SELECT 
    "CareProvider"."CTLOC_Code",
    "CareProvider"."CarpCode" AS "ID",
    "CareProvider"."CarpDesc" AS "Name",
    "CareProvider"."NameTH",
    "CareProvider"."NameEN"
    FROM "RoomDetail" INNER JOIN "CareProvider" 
    ON "CareProvider"."CarpCode" = "RoomDetail"."CarpCode"
    ORDER BY "CareProvider"."CarpDesc" ASC;`
    const values = []
    let records = []
    
    let results
    try{
        results = await pg_pool.execute(text,values) 
        for (let carp of results.rows) {
            
            const text1 = `SELECT 
            "Service"."BDMSItemCode" AS "Code",
            "Service"."BDMSItemDesc" AS "Service",
            "Service"."BDMSTimeInMinute" AS "Time"
            FROM "CareProviderService"
            INNER JOIN "RoomDetail" ON
            "CareProviderService"."CarpCode" = "RoomDetail"."CarpCode"
            INNER JOIN "CareProvider" ON
            "CareProviderService"."CarpCode" = "CareProvider"."CarpCode"
            INNER JOIN "Service" ON
            "CareProviderService"."BDMSItemCode" = "Service"."BDMSItemCode"
            WHERE "CareProviderService"."CarpCode"=$1 AND "RoomDetail"."CarpStatus"='In';`
            const values1 = [carp.ID]
            try{
                let payload = await pg_pool.execute(text1,values1)
                let myObj = {
                    Code: carp.ID,
                    Name: carp.NameEN,
                    Services: payload.rows
                }
                await records.push(myObj)
            } catch (error) {
                console.log(error)
            }

        }

        dataInMem={ ResourceService: await records}

    } catch (error) {
        console.log(error)
    }
}

const retrieveData = async (req, res) => {

    const text = `SELECT "CTLOC_Code","CarpCode" AS "ID","CarpDesc" AS "Name","NameTH","NameEN" FROM public."CareProvider"`
    const values = []
    let records = []
    
    let results

    try{
        results = await pg_pool.execute(text,values)
    } catch (error) {
        //console.log(error)
        res.status(400).json({
            "Code":501,
            "Message": 'Not Implemented',
            "Status":false
        })
    }

    const promises = results.rows.map(async carp => {
        
        const text1 = `SELECT 
        "Service"."BDMSItemCode" AS "Code",
        "Service"."BDMSItemDesc" AS "Service",
        "Service"."BDMSTimeInMinute" AS "Time"
        FROM "CareProviderService"
        INNER JOIN "RoomDetail" ON
        "CareProviderService"."CarpCode" = "RoomDetail"."CarpCode"
        INNER JOIN "CareProvider" ON
        "CareProviderService"."CarpCode" = "CareProvider"."CarpCode"
        INNER JOIN "Service" ON
        "CareProviderService"."BDMSItemCode" = "Service"."BDMSItemCode"
        WHERE "CareProviderService"."CarpCode"=$1 AND "RoomDetail"."CarpStatus"='In' LIMIT 5`
        const values1 = [carp.ID]

        let payload
        try{
            payload = await pg_pool.execute(text1,values1)
        } catch (error) {
            //console.log(error)
            res.status(400).json({
                "Code":501,
                "Message": 'Not Implemented',
                "Status":false
            })
        }
        
        let myObj = {
            Code: carp.ID,
            Name: carp.NameEN,
            Services: payload.rows
        }
        await records.push(myObj)
    })

    await Promise.all(promises);

    res.status(200).json({
        ResourceService: await records
    })


}

const getCareProviderService = async () => {

    //get token
    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)

    axios.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN.access_token 
    
    //Step1 GetCareProviderByLocation 
    let resCarePro = undefined
    try {
        resCarePro = await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/GetCareProviderByLocation?input1=01DEN&input2=dentist')
    } catch (error) {
        console.log(error)
    }
    //Step2 GetServiceByLocationAndCareProvider
    const promisesCarePro = resCarePro.data.map(async elem => {

        let resCareProService = undefined
        try {
            resCareProService = await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/GetServiceByLocationAndCareProviderCode?input1=01DEN&input2='+elem.CarpCode)
            
            const promisesCareProService = resCareProService.data.map(val => {
         
                const text = `INSERT INTO "CareProviderService"(
                    "CarpCode", "BDMSItemCode", "BDMSMaxAllow", "BDMSRemainder")
                    VALUES ($1, $2, $3, $4);`
                const values = [elem.CarpCode,val.BDMSItemCode,val.BDMSMaxAllow,val.BDMSRemainder]
            
                ;(async () => {
                    await pg_pool.execute(text,values)
                })().catch(err => {
                    console.log(err.stack)
                })
            });
            
            await Promise.all(promisesCareProService);

        } catch (error) {
            console.log(error)
        }

    })

    await Promise.all(promisesCarePro);

}

const deleteCareProviderService = async () => {

    const text = `DELETE FROM public."CareProviderService";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
    })().catch(err => {
        console.log(err.stack)
    })

}

module.exports = {
    retrieveData,retrieveDataTest,
    loadDataInMem,
    getCareProviderService,
    deleteCareProviderService
}
