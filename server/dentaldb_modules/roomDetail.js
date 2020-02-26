const pg_pool = require('./pgpool');

const retrieveData = async (req, res) => {

    const text = `SELECT 
    "RoomDetail"."ID" AS "id",
    "CareProvider"."CarpCode" AS "resource_id",
    "CareProvider"."CarpDesc" AS "resource",
    "RoomDetail"."Room" AS "room",
    "RoomDetail"."ScheduleTime" AS "schedule_time",
    "RoomDetail"."LocationCode" AS "location",
    "AssistanceDentist"."AssistCode" AS "assistant_id",
    "AssistanceDentist"."AssistDesc" AS "assistant"
    FROM "RoomDetail" INNER JOIN "CareProvider" ON
    "RoomDetail"."CarpCode"="CareProvider"."CarpCode"
    INNER JOIN "AssistanceDentist" ON
    "RoomDetail"."AssistCode"="AssistanceDentist"."AssistCode"
    WHERE "CarpStatus" = 'In';`
    const values = []
    
    let myObj 
    ;await (async () => {
        let results = await pg_pool.execute(text,values)
        
        res.status(200).json(results.rows)
        //console.log(results.rows)
    })().catch(err => {
        res.status(501).send({})
        //myObj = err.stack
        //console.log(err.stack)
    })
    return myObj

}

const deleteRoomDetail = async (req, res) => {

    const text = `DELETE FROM public."RoomDetail";`
    const values = []
    ;(async () => {
        await pg_pool.execute(text,values)
        console.log('LOGD: delete all data room details.')
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

module.exports = {
    retrieveData,
    deleteRoomDetail
}