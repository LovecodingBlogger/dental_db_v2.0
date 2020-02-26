const axios = require('axios');
const token = require('./accessToken');
const pg_pool = require('./pgpool');

let dataInMem = []
const loadDataInMem = async (req, res) => {
    res.status(200).json(dataInMem)
}

const retrieveDataTest = async (req, res) => {
    
    const text = `SELECT "CTLOC_Code","CarpCode" AS "ID","CarpDesc" AS "Name","NameTH","NameEN" FROM public."CareProvider" ORDER BY "CarpDesc" ASC`
    const values = []
    let records = []
    
    let results
    try{
        results = await pg_pool.execute(text,values) 
        for (let carp of results.rows) {
            
            const text1 = `SELECT "PatientAppointment"."ID" AS "id",
            concat(split_part("PatientAppointment"."AS_SessStartTime",':',1),':',
			split_part("PatientAppointment"."AS_SessStartTime",':',2)) AS "timeAppointment",
            to_date("PatientAppointment"."AS_Date", 'YYYY-MM-DD') AS "dateAppointment",
            "PatientAppointment"."HN" AS "patientId",
            "PatientAppointment"."Fullname" AS "patientName",
            "Service"."BDMSItemCode" AS "serviceId",
            "Service"."BDMSItemDesc" AS "serviceName",
            "Service"."BDMSTimeInMinute" AS "timeOfService",
            "PatientAppointment"."Sex_Desc" AS "gender",
            "PatientStatus"."StatusDesc" AS "status"
            FROM "PatientAppointment" INNER JOIN "Service" ON "PatientAppointment"."ServiceCode" = "Service"."BDMSItemCode"
            INNER JOIN "PatientStatus" ON "PatientAppointment"."PT_Status"="PatientStatus"."StatusSymbol"
            WHERE "CarpCode"=$1 ORDER BY "PatientAppointment"."AS_SessStartTime" ASC;`
            const values1 = [carp.ID]
            try{
                let payload = await pg_pool.execute(text1,values1)
                let myObj = {
                    resourceId: carp.ID,
                    resourceName: carp.NameEN,
                    resourceSchedule: payload.rows
                }
                await records.push(myObj)
            } catch (error) {
                console.log(error)
            }

        }

        dataInMem={ test: await records}

    } catch (error) {
        console.log(error)
    }
}

const retrieveData = async (req, res) => {
    

    const text = `SELECT "CTLOC_Code","CarpCode" AS "ID","CarpDesc" AS "Name","NameTH","NameEN" FROM public."CareProvider" ORDER BY "CarpDesc" ASC LIMIT 20`
    const values = []
    let records = []
    
    let results

    try{
        results = await pg_pool.execute(text,values)
        console.log(results.row)
        
    } catch (error) {
        //console.log(error)
        res.status(400).json({
            "Code":501,
            "Message": 'Not Implemented',
            "Status":false
        })
    }
    
    //console.log(results.rows)
    const promises = results.rows.map(async carp => {
        
        const text1 = `SELECT "PatientAppointment"."ID" AS "id",
        "PatientAppointment"."AS_SessStartTime" AS "timeAppointment",
        to_date("PatientAppointment"."AS_Date", 'YYYY-MM-DD') AS "dateAppointment",
        "PatientAppointment"."HN" AS "patientId",
        "PatientAppointment"."Fullname" AS "patientName",
        "Service"."BDMSItemCode" AS "serviceId",
        "Service"."BDMSItemDesc" AS "serviceName",
        "PatientAppointment"."Sex_Desc" AS "gender",
		"PatientStatus"."StatusDesc" AS "status"
        FROM "PatientAppointment" INNER JOIN "Service" ON "PatientAppointment"."ServiceCode" = "Service"."BDMSItemCode"
        INNER JOIN "PatientStatus" ON "PatientAppointment"."PT_Status"="PatientStatus"."StatusSymbol"
		WHERE "CarpCode"=$1 ORDER BY "PatientAppointment"."AS_SessStartTime" ASC;`
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
            resourceId: carp.ID,
            resourceName: carp.NameEN,
            resourceSchedule: payload.rows
        }
        await records.push(myObj)
    })

    await Promise.all(promises);

    dataInMem = {test: await records}

    res.status(200).json({
        test: await records
    })

}

const retrievePatientStatus = async (req, res) => {

    const text = `SELECT 
    "PatientAppointment"."ID" AS "id",
    "PatientAppointment"."HN" AS "patient_id",
    "PatientStatus"."StatusDesc" AS "status",
    "PatientAppointment"."Room" AS "room",
    "PatientAppointment"."AS_Date" AS "date_appointment",
    "PatientAppointment"."AS_SessStartTime" AS "time_appointment",
    "PatientAppointment"."APPT_ArrivalTime" AS "time_register",
	"PatientAppointment"."ServiceCode" AS "service_id",
	"PatientAppointment"."CarpCode" AS "resource_id",
    "PatientAppointment"."LocCode" AS "location"
    FROM "PatientAppointment"
	INNER JOIN "PatientStatus" 
	ON "PatientAppointment"."PT_Status"="PatientStatus"."StatusSymbol"`
    const values = []
    
    let myObj 
    ;await (async () => {
        let results = await pg_pool.execute(text,values)
        
        res.status(200).json(results.rows)
    })().catch(err => {
        res.status(501).send({})
        //console.log(err.stack)
    })
    return myObj

}

const getPatientAppointment = async () => {

    //get token
    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)

    axios.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN.access_token

    let result = undefined

    try {
        result = await await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/GetAppointment?input1=01DEN&input2=2020-02-04')
        //console.log(result)
    } catch (error) {
        console.log(error)
    }

    const promises = result.data.map(elem => {
        let text = `INSERT INTO public."PatientAppointmentTemp"(
            "PAADM_RowID", "HN", "EN", "Name", "Surname", "MiddleName", "Title", "Sex_Code", "Sex_Desc", "CarpCode", "ServiceCode", "AS_Date", "AS_SessStartTime", "APPT_ArrivalDate", "APPT_ArrivalTime", "APPT_CancelDate", "APPT_CancelTime", "LocCode", "LocDesc", "APPT_RowId", "PAADM_VisitStatus", "APPTStatus", "Fullname", "PT_Status")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);`
        let values = [
            elem.PAADM_RowID,
            elem.HN,
            elem.EN,
            elem.Name,
            elem.Surname,
            elem.MiddleName,
            elem.Title,
            elem.Sex_Code,
            elem.Sex_Desc,
            elem.CarpCode,
            elem.ServiceCode,
            elem.AS_Date,
            elem.AS_SessStartTime,
            elem.APPT_ArrivalDate,
            elem.APPT_ArrivalTime,
            elem.APPT_CancelDate,
            elem.APPT_CancelTime,
            elem.LocCode,
            elem.LocDesc,
            elem.APPT_RowId,
            elem.PAADM_VisitStatus,
            elem.APPTStatus,
            elem.Fullname,
            'B',
        ]
       
        ;(async () => {
            await pg_pool.execute(text,values)
        })().catch(err => {
            console.log(err.stack)
        })
    });

    await Promise.all(promises);

}

const deletePatientAppointment = async () => {
    
    const text = `DELETE FROM public."PatientAppointmentTemp";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
    })().catch(err => {
        console.log(err.stack)
    })

}

const deleteAppointmentRoutes = async (req, res) => {
    
    const text = `DELETE FROM public."PatientAppointment";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
        console.log('LOGD: delete all data patient appointments.')
        res.status(200).json({
            "Code":200,
            "Message":"OK",
            "Status": true
        })
    })().catch(err => {
        console.log(err.stack)
        res.status(400).json({
            "Code":400,
            "Message":"Bad Request",
            "Status":false
        })
    })

}

const validateNewAppointment = async () => {
    
    const text = `SELECT "APTemp".* FROM "PatientAppointmentTemp" AS "APTemp" 
    LEFT JOIN "PatientAppointment" AS "AP" ON "APTemp"."PAADM_RowID"="AP"."PAADM_RowID" 
    WHERE "AP"."PAADM_RowID" IS NULL`
    const values = []
    ;(async () => {
        let result = await pg_pool.execute(text,values)
        //console.log(result.rows)
        const promises = result.rows.map(elem => {
            let text = `INSERT INTO "PatientAppointment"(
                "PAADM_RowID", "HN", "EN", "Name", "Surname", "MiddleName", "Title", "Sex_Code", "Sex_Desc", "CarpCode", "ServiceCode", "AS_Date", "AS_SessStartTime", "APPT_ArrivalDate", "APPT_ArrivalTime", "APPT_CancelDate", "APPT_CancelTime", "LocCode", "LocDesc", "APPT_RowId", "PAADM_VisitStatus", "APPTStatus", "Fullname", "PT_Status")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);`
            let values = [
                elem.PAADM_RowID,
                elem.HN,
                elem.EN,
                elem.Name,
                elem.Surname,
                elem.MiddleName,
                elem.Title,
                elem.Sex_Code,
                elem.Sex_Desc,
                elem.CarpCode,
                elem.ServiceCode,
                elem.AS_Date,
                elem.AS_SessStartTime,
                elem.APPT_ArrivalDate,
                elem.APPT_ArrivalTime,
                elem.APPT_CancelDate,
                elem.APPT_CancelTime,
                elem.LocCode,
                elem.LocDesc,
                elem.APPT_RowId,
                elem.PAADM_VisitStatus,
                elem.APPTStatus,
                elem.Fullname,
                'B',
            ]
            
            console.log(elem.HN);
            
            ;(async () => {
                await pg_pool.execute(text,values)
            })().catch(err => {
                console.log(err.stack)
            })
        });
    
        await Promise.all(promises);

    })().catch(err => {
        console.log(err.stack)
    })

}

const validateUpdateAppointment = async () => {
    
    const text = `SELECT "AP"."ID",
    "APTemp"."APPT_ArrivalDate","APTemp"."APPT_ArrivalTime",
    "APTemp"."APPT_CancelDate","APTemp"."APPT_CancelTime"
    FROM "PatientAppointment" AS "AP"
    INNER JOIN "PatientAppointmentTemp" AS "APTemp" ON 
    "AP"."PAADM_RowID" = "APTemp"."PAADM_RowID"
    WHERE ("AP"."APPT_ArrivalDate"!="APTemp"."APPT_ArrivalDate") OR 
    ("AP"."APPT_CancelDate"!="APTemp"."APPT_CancelDate")`
    const values = []
    ;(async () => {
        let result = await pg_pool.execute(text,values)
        //console.log(result.rows)
        /*B: Booked, A: Arrived,P: Processing,H: Hold,E: End Service, C: Canceled*/
        let patient_status = undefined
        const promises = result.rows.map(elem => {
            if(elem.APPT_ArrivalDate!=null){     
                //console.log("Arrived")
                patient_status = 'A'
            }else if(elem.APPT_CancelDate!=null){
                //console.log("Canceled")
                patient_status = 'C'
            }else{console.log("Not Found Status!")}
            let text = `UPDATE "PatientAppointment"
            SET "APPT_ArrivalDate"=$2, "APPT_ArrivalTime"=$3, "APPT_CancelDate"=$4, "APPT_CancelTime"=$5,"PT_Status"=$6
            WHERE "ID"=$1;`
            let values = [
                elem.ID,
                elem.APPT_ArrivalDate,
                elem.APPT_ArrivalTime,
                elem.APPT_CancelDate,
                elem.APPT_CancelTime,
                patient_status
            ]
            
            console.log('update patient status ' +elem.ID+' to '+patient_status);

            ;(async () => {
                await pg_pool.execute(text,values)
            })().catch(err => {
                console.log(err.stack)
            })
            
        });

        await Promise.all(promises);

    })().catch(err => {
        console.log(err.stack)
    })

}

module.exports = {
    retrieveData,retrieveDataTest,loadDataInMem,
    retrievePatientStatus,
    getPatientAppointment,
    deletePatientAppointment,
    validateNewAppointment,
    validateUpdateAppointment,
    deleteAppointmentRoutes
}
