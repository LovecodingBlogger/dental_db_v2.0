/**
 * @file index.js
 * @author Kitsana Panja (561997001@crru.ac.th)
 * @brief Dental Dashboard
 * @version 1.1
 * @date 2020-02-13
 * 
 * @copyright Copyright (c) 2019
 * 
 */

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var schedule = require('node-schedule');
const pg = require('pg')
const socketIO = require('socket.io')
const dotenv = require('dotenv');
dotenv.config();
const room = require('./dbRoom')
const time = require('./dbTime')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
 
app.use(bodyParser.raw({ type: 'text/xml' }))
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(8080, () => {
  console.log('Start server at port 8080.')
})

const jobsh = require('./dentaldb_modules/jobsh');
const careProvider = require('./dentaldb_modules/careProvider');
const careProviderService = require('./dentaldb_modules/careProviderService');
const appointment = require('./dentaldb_modules/patientAppointment');
const signonTrakcare = require('./dentaldb_modules/signonTrakcare');
const roomDt = require('./dentaldb_modules/roomDetail');
const serviceCarePro = require('./dentaldb_modules/service');
const doctorSchedule = require('./dentaldb_modules/doctorSchedule');

async function initTaskJobSchedule(){
	await jobsh.taskGetMasterDataFromTrakcare()
	await jobsh.taskIntervalGetDataFromTrakcare()
}

initTaskJobSchedule()

const io = socketIO.listen(server);
io.on('connection', client => {
	console.log('user connected')
	client.on('disconnect', () => {
		console.log('user disconnected')
	})
	client.on('dataSchedule', data => {
		// Recive data from socket client
	})
})

const pool = new pg.Pool({
	user: process.env.USER_DB,
	host: '127.0.0.1',
	database: 'dental_db',
	password: process.env.PASSWORD_DB,
	port: process.env.PORT,
	idleTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS
})

var options = {
	additionalDigits: 2,
}

/*
var dateFns = require("date-fns")
//0 is Jan
var result = dateFns.eachDayOfInterval(
	{ start: new Date(2020, 1, 1), end: new Date(2020, 1, 30) }
)

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//console.log(days[result[0].getDay()])
//console.log(result)
for(ptr in result){
	console.log(result[ptr]+' ::: '+result[ptr].getDay()+' '+days[result[ptr].getDay()])
}*/
//console.log(result[0]+' ::: '+result[0].getDay())

app.post('/logonTrakcare', signonTrakcare.Authorization)
//Edit new interface trakcare
//app.get('/careProviderService', careProviderService.retrieveData)
app.get('/careProviderService', careProviderService.loadDataInMem)

//app.get('/patientAppointment', appointment.retrieveData)
app.get('/patientAppointment', appointment.loadDataInMem)
app.get('/patientAppointmentTest', appointment.loadDataInMem)
app.delete('/patientAppointment', appointment.deleteAppointmentRoutes)
app.get('/careProvider', careProvider.retrieveData)
app.delete('/roomDetail', roomDt.deleteRoomDetail)
app.get('/roomDetail', roomDt.retrieveData)
app.get('/service', serviceCarePro.retrieveData)
app.get('/patientStatus', appointment.retrievePatientStatus)
app.get('/careProviderWorkload', doctorSchedule.loadDataInMem)

app.get('/room', (req, res) => {
   res.json(room)
})

app.get('/time', (req, res) => {
   res.json(time)
})

//Schedule Job Get Master from trakcare
var j = schedule.scheduleJob({hour: 16, minute: 47 }, function(){
	console.log('----- GET MASTER DATA -----');
});

setInterval(jobsh.taskIntervalGetDataFromTrakcare, 50000); // update every 3 m

/**
* @brief API Room Detail.
* 
* Call api when resource register to room.
* http://localhost:8080/roomDetail
* 
* @param TransectionId
* @param ResourceId Resource Id 
* @param Resource Resource Name
* @param Room Room no.
* @param AssistantId Assistant Id
* @param Assistant Assistant Name
* @param ScheduleTime StartTime and EndTime
* @param Location Location Code
*
*/
app.post('/roomDetail', async (req, res) => {

	var json = req.body;

	if(json.ResourceId==undefined||json.ResourceId=="" ||
	json.Resource==undefined||json.Resource=="" ||
	json.Room==undefined||json.Room=="" ||
	json.AssistantId==undefined||json.AssistantId=="" ||
	json.Assistant==undefined||json.Assistant=="" ||
	json.Location==undefined||json.Location==""){

		res.status(400).json({
			"Code":400,
			"Message":"Bad Request",
			"Status":false
		})

	}else {

		//Dentist Logout
		if(json.Room === "Out"){
			
			;(async () => {
				const client = await pool.connect()
				try {
					await client.query(`UPDATE public."RoomDetail" SET "CarpStatus"='Out' WHERE "CarpCode"=$1`, [json.ResourceId])
					res.status(201).json({
						"Code":200,
						"Message":"OK",
						"Status": true
					})
					io.sockets.emit('dataRoomDetail', {resource_id: json.ResourceId, resource: json.Resource, room : json.Room, schedule_time : json.ScheduleTime, assistant: json.Assistant,status: 'Out'})
				}finally {
					client.release()
				}
			})().catch(err => {
				console.log(err.stack)
				res.status(400).json({
					"Code":400,
					"Message":"Bad Request",
					"Status":false
				})
			})

	   }else{
		   
			//Dentist Login
			;(async () => {
				const client = await pool.connect()
				try {
					const res = await client.query(`UPDATE public."RoomDetail" SET "CarpStatus"='Out' WHERE "Room"=$1 OR "CarpCode"=$2`, [json.Room,json.ResourceId])
					console.log(res.rows[0])
				} finally {
					//client.release()
				}

				try {
					await client.query(`INSERT INTO public."RoomDetail"(
						"CarpCode", "AssistCode", "ScheduleTime", "LocationCode", "CarpStatus", "Room")
						VALUES ($1, $2, $3, $4, $5, $6);`, [json.ResourceId,json.AssistantId, json.ScheduleTime,json.Location,'In',json.Room])
					res.status(201).json({
						"Code":201,
						"Message":"Created",
						"Status": true
					})
				} finally {
					client.release()
				}

			})().catch(err => {
				console.log(err.stack)
				res.status(400).json({
					"Code":400,
					"Message":"Bad Request",
					"Status":false
				})
			})

		}
   }

})

/**
* @brief API patientStatus.
* 
* Call this api for update patient status.
* http://localhost:8080/patientStatus
* 
* @param TransactionId 
* @param PatientId Patient ID
* @param EpisodeNumber
* @param Room  Room no.
* @param PatientStatus Patient status
* @param Location Location Code
*
*/
app.post('/patientStatus', (req, res) => {

	var json = req.body;
	
	if(json.TransactionId==undefined||json.TransactionId==''||
	json.PatientId==undefined||json.PatientId==''||
	//json.EpisodeNumber==undefined||json.EpisodeNumber==''||
	json.Room==undefined||json.Room==''||
	json.PatientStatus==undefined||json.PatientStatus==''||
	json.Location==undefined||json.Location==''){

		res.status(400).json({
		  "Code":400,
		  "Message":"Bad Request",
		  "Status":false
		})

	}else{

		let status = undefined
		switch(json.PatientStatus) {
			case "Book":
				status = 'B' //Booked
				  break;
			case "Arrive":
				status = 'A' //Arrived
				  break;
			case "Cancel":
				status = 'C' //Canceled
			  	break;
			case "Call":
				status = 'P' //Processing
			  	break;
			case "Hold":
				status = 'H' //Hold
			  	break;
			case "End Service":
				status = 'E' //End Service
			break;
			default:
				break;
		}

		;(async () => {
			const client = await pool.connect()
			
			try {
				//await client.query(`UPDATE public."PatientAppointment" SET "PT_Status"=$1 WHERE "HN"=$2 AND "EN"=$3`, [tempStatus,json.PatientId,json.EpisodeNumber])
				await client.query(`UPDATE public."PatientAppointment" SET "PT_Status"=$1,"Room"=$2 WHERE "HN"=$3`, [status,json.Room,json.PatientId])
				res.status(200).json({
					"Code":200,
					"Message":"OK",
					"Status": true
				})
				io.sockets.emit('StatusPatient', "update")
			}finally {
				client.release()
			}
		})().catch(err => {
			console.log(err.stack)
			res.status(400).json({
				"Code":400,
				"Message":"Bad Request",
				"Status":false
			})
		})

	}

})
