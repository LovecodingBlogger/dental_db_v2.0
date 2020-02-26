
const axios = require('axios');
const token = require('./accessToken');
const pg_pool = require('./pgpool');

let dateFns = require("date-fns")

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let dataInMem = []
const loadDataInMem = async (req, res) => {
    res.status(200).json(dataInMem)
}

const retrieveData = async (req, res) => {

    let cur_date = new Date()//dateFns.format(new Date(),'yyyy-MM-dd')
    //console.log('$$$$$$$$$$$$$$$ '+days[cur_date.getDay()]+' $$$$$$$$$$$$$$$')
    const text = `
    WITH "DoctorSch" AS (
        SELECT 
        "DoctorCode",SUM(split_part(("TimeEnd"::time - "TimeStart"::time)::text,':',1)::int*60 +
        split_part(("TimeEnd"::time - "TimeStart"::time)::text,':',2)::int) AS "SUMSLOT"
        FROM "DoctorSchedule" 
        INNER JOIN "RoomDetail" ON "DoctorSchedule"."DoctorCode"="RoomDetail"."CarpCode"
        WHERE $1 BETWEEN "StartDate" AND "EndDate" AND "RoomDetail"."CarpStatus"='In'
        AND "Day"=$2 GROUP BY "DoctorCode"
    )
    SELECT "RoomDetail"."CarpCode",
    "DoctorSch"."SUMSLOT",
    SUM("Service"."BDMSTimeInMinute"::int) AS "SUMSERVICE",
    SUM("Service"."BDMSTimeInMinute"::int)::float/"DoctorSch"."SUMSLOT"::float AS "Workload"
    FROM "RoomDetail" INNER JOIN "PatientAppointment"
    ON "RoomDetail"."CarpCode" = "PatientAppointment"."CarpCode"
    INNER JOIN "Service" ON "Service"."BDMSItemCode"="PatientAppointment"."ServiceCode"
    INNER JOIN "DoctorSch" ON "RoomDetail"."CarpCode"="DoctorSch"."DoctorCode"
    WHERE split_part("PatientAppointment"."AS_SessStartTime",':',2)!='04' AND 
    split_part("PatientAppointment"."AS_SessStartTime",':',2)!='09' AND 
    "RoomDetail"."CarpStatus"='In'
    GROUP BY "RoomDetail"."CarpCode","DoctorSch"."SUMSLOT"`
    //const values = [dateFns.format(new Date(),'yyyy-MM-dd'),days[cur_date.getDay()]]
    //test Tuesday
    const values = ['2020-02-29','Tuesday']
    ;await (async () => {
        let results = await pg_pool.execute(text,values)
        //console.log(results.rows)
        //res.status(200).json(results.rows)
        dataInMem = await results.rows
        //console.log(myObj)
    })().catch(err => {
        //res.status(501).send({})
        //console.log(err.stack)
    })

}

const setRoomDetail = (rows) => {

    let result = dateFns.eachDayOfInterval(
        { start: new Date(rows.StartDate), end: new Date(rows.EndDate) }
    )

    //let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    /*for(ptr in result){
        console.log(result[ptr]+' ::: '+result[ptr].getDay()+' '+days[result[ptr].getDay()])
    }*/
    console.log('................... '+ rows.DoctorCode + '...................')
    for (let elem of result) {
        if(rows.Day == days[elem.getDay()]){
            //console.log(elem+' ::: '+elem.getDay()+' '+days[elem.getDay()])
            /*
            let text = `WITH rowid AS (
                SELECT
                MAX("ID") AS id
                FROM "DoctorSchedule" WHERE "DoctorSchedule"."ID" IS NOT NULL
            )
            INSERT INTO public."DoctorScheduleDetail"(
                "Date", "DoctorScheduleID")
                VALUES ($1, (SELECT id FROM rowid));`
            let values = [
                elem.getDay()
            ]
            
            ;(async () => {
                await pg_pool.execute(text,values)
            })().catch(err => {
                console.log(err.stack)
            })*/
        }
    }
}

const getDoctorSchedule = async () => {

    const text = `SELECT "CarpCode" FROM public."CareProvider" ORDER BY "CarpCode" DESC`
    const values = []
    let records = []

    try{
        records = await pg_pool.execute(text,values)
        console.log('count care pro sh --> ' +records.rows.length)
    } catch (error) {
        console.log(error)
    }

    /*const promises = await records.rows.map(async carp => {
        await sleep(0);  
        return axios
            .get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/getDoctorSchedule?Input1='+carp.CarpCode+'&Input2=2020-02-01&Input3=2020-02-29')
            .then(res => res.data)
            .catch(e => console.error('hello'+e));
        
    })*/

    let counter = 0
    let retryFlags = 0

    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)
    axios.defaults.headers.common['Authorization'] = await `Bearer ${AUTH_TOKEN.access_token}`
    let startDate = dateFns.format(dateFns.startOfMonth(new Date()),'yyyy-MM-dd')
    let endDate = dateFns.format(dateFns.endOfMonth(new Date()),'yyyy-MM-dd')
    //console.log('>>>>>>>>>>> '+startDate+ ' '+ endDate)
    
    const promises = records.rows.map(async carp => {
        retryFlags = 0
        let payload_msg = ''
        try {
            
            await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/getDoctorSchedule?Input1='+carp.CarpCode+'&Input2='+startDate+'&Input3='+endDate, {
                timeout: 10000, //10 second
            })
            .then(function (response) {
                payload_msg = response.data
                // handle success
                //console.log(response.data);
                //console.log(response.status);
                //console.log(response.headers);
                //console.log(response.statusText);
                //console.log(response.config);
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_function
                payload_msg.map(function(rows){

                    let text = `INSERT INTO public."DoctorScheduleTemp"(
                        "FieldRow", "EffDate", "DoctorCode", "LocationCode", "LocationDesc", "Day", "TimeStart", "TimeEnd", "StartDate", "EndDate", "Length", "noOf", "Loadlevel", "noOfApp", "DoctorGroup")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`
                    let values = [
                        rows.FieldRow,
                        rows.EffDate,
                        rows.DoctorCode,
                        rows.LocationCode,
                        rows.LocationDesc,
                        rows.Day,
                        rows.TimeStart,
                        rows.TimeEnd,
                        rows.StartDate,
                        rows.EndDate,
                        rows.Length,
                        rows.noOf,
                        rows.Loadlevel,
                        rows.noOfApp,
                        rows.DoctorGroup
                    ]
                    
                    ;(async () => {
                        await pg_pool.execute(text,values)
                    })().catch(err => {
                        console.log(err.stack)
                    })
                    delay(1500) //delay 1 second
                    return counter++
                })

            })
            .catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
                console.log(error.response.status);
                retryFlags = 1
                //console.log(payload_msg)
                return Promise.reject(new Error('reject'));

            });
          
        } catch (error) {
            
            //console.log(error)
        }

        delay(1500) //delay 1 second
        return Promise.resolve('fulfilled')
    })

    await Promise.all(promises);
    console.log('LOGD :: counter value ' +counter)
    return retryFlags

    /*let count = 0
    await Promise.all(promises).then(res => {
        for(i in res){
            //console.log(res[i])
            count+=res[i].length
            console.log('code: '+res[i].CarpCode+' val: '+ res[i].length +' conter ::: ' + count)
            
            if(res[i].length > 700){
                console.log(res[i])
            }
        }
    });*/
    //https://flaviocopes.com/javascript-async-await-array-map/
}

const deleteDoctorSchedule = async () => {
    
    const text = `DELETE FROM public."DoctorScheduleTemp";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
    })().catch(err => {
        console.log(err.stack)
    })
    
}

const validateNewDoctorSchedule = async () => {
    
    ;(async () => {

        const text = `SELECT "DoctorScheduleTemp".* FROM "DoctorScheduleTemp"
        LEFT JOIN "DoctorSchedule"
        ON "DoctorScheduleTemp"."FieldRow"="DoctorSchedule"."FieldRow" AND
        "DoctorScheduleTemp"."DoctorCode"="DoctorSchedule"."DoctorCode" AND
        "DoctorScheduleTemp"."Day"="DoctorSchedule"."Day" AND
        "DoctorScheduleTemp"."StartDate"="DoctorSchedule"."StartDate" AND
        "DoctorScheduleTemp"."EndDate"="DoctorSchedule"."EndDate" AND
        "DoctorScheduleTemp"."TimeStart"="DoctorSchedule"."TimeStart" AND
        "DoctorScheduleTemp"."TimeEnd"="DoctorSchedule"."TimeEnd"
        WHERE "DoctorSchedule"."ID" IS NULL ORDER BY "DoctorScheduleTemp"."DoctorCode" ASC`
        const values = []

        let result = await pg_pool.execute(text,values)
        
        const promises = result.rows.map(elem => {

            let values = [
                elem.FieldRow,
                elem.EffDate,
                elem.DoctorCode,
                elem.LocationCode,
                elem.LocationDesc,
                elem.Day,
                elem.TimeStart,
                elem.TimeEnd,
                elem.StartDate,
                elem.EndDate,
                elem.Length,
                elem.noOf,
                elem.Loadlevel,
                elem.noOfApp,
                elem.DoctorGroup
            ]
            //console.log('StartDate: ' + temp.StartDate + ' EndDate: ' +temp.EndDate)
            
            //When update in room detail call this function update transaction of room detail
            setRoomDetail(elem)

            ;(async () => {
                let res =  await pg_pool.execute(`INSERT INTO public."DoctorSchedule"(
                    "FieldRow", "EffDate", "DoctorCode", "LocationCode", "LocationDesc", "Day", "TimeStart", "TimeEnd", "StartDate", "EndDate", "Length", "noOf", "Loadlevel", "noOfApp", "DoctorGroup")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`,values)
                //console.log(res)
                return Promise.resolve('fulfilled')
            })().catch(err => {
                console.log(err.stack)
                return Promise.reject(new Error('reject'));
            })
        });
        
        

        await Promise.all(promises);
        

    })().catch(err => {
        console.log(err.stack)
    })
    
    
}

module.exports = {
    retrieveData,loadDataInMem,
    getDoctorSchedule,
    deleteDoctorSchedule,
    validateNewDoctorSchedule
}

