const axios = require('axios');
const token = require('./accessToken');
const pg_pool = require('./pgpool');

const retrieveData = async (req, res) => {

    const text = `SELECT "CTLOC_Code","AssistCode" AS "ID","AssistDesc" AS "Name","NameTH","NameEN" FROM public."AssistanceDentist"`
    const values = []
    
    let myObj 
    ;await (async () => {
        let results = await pg_pool.execute(text,values)
        myObj = await {
            resource: results.rows
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

const getAssistanceDentist = async () => {

    //get token
    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)

    axios.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN.access_token 
    
    let response = undefined
    try {
        response = await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/GetCareProviderByLocation?input1=01DEN&input2=assist_dentist')
    } catch (error) {
        console.log(error)
    }

    const promises = response.data.map(elem => {
        const text = `INSERT INTO "AssistanceDentist"(
            "CTLOC_Code", "CarpRowID", "AssistCode", "AssistDesc", "SecurityGroup", "SecurityGroupID", "DeafultLogin", "NameTH", "NameEN", "CareProRowID", "CareProDesc", "CTPCP_CarPrvTp_DR", "CarProType", "ActiveDateFrom", "ActiveDateTo")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`
        const values = [elem.CTLOC_Code,elem.CarpRowID,elem.CarpCode,elem.CarpDesc,elem.SecurityGroup,
            elem.SecurityGroupID,elem.DeafultLogin,elem.carepro_nameTH,elem.carepro_nameEN,elem.CareProRowID,elem.CareProDesc,
            elem.CTPCP_CarPrvTp_DR,elem.CarProType,elem.ActiveDateFrom,elem.ActiveDateTo]
    
        ;(async () => {
            await pg_pool.execute(text,values)
        })().catch(err => {
            console.log(err.stack)
        })
    });
    
    await Promise.all(promises);

}

const deleteAssistanceDentist = async () => {

    const text = `DELETE FROM public."AssistanceDentist";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
    })().catch(err => {
        console.log(err.stack)
    })

}

module.exports = {
    retrieveData,
    getAssistanceDentist,
    deleteAssistanceDentist
}
