
const service = require('./service');
const careProvider = require('./careProvider');
const assistDentist = require('./assistanceDentist');
const careProService = require('./careProviderService');
const doctorSchedule = require('./doctorSchedule');

const patientAppointment = require('./patientAppointment');

const taskGetMasterDataFromTrakcare = async () => {


    //--------- Care Provider ----------
    console.log("[LOGD] jobsh delete care provider")
    await careProvider.deleteCareProvider()
    console.log("[LOGD] jobsh get care provider")
    await careProvider.getCareProvider()

    //--------- Assistance Dentist ----------
    console.log("[LOGD] jobsh delete assistance dentist")
    await assistDentist.deleteAssistanceDentist()
    console.log("[LOGD] jobsh get assistance dentist")
    await assistDentist.getAssistanceDentist()

    //--------- Service  ----------
    console.log("[LOGD] jobsh delete service")
    await service.deleteService()
    console.log("[LOGD] jobsh get service")
    await service.getService()

    //await careProService.deleteCareProviderService()
    //await careProService.getCareProviderService()

    let retry = 5
    let retryFlags = 0
    while(retry > 0){
        console.log("\n\n############ START #############")
        //console.log("[LOGD] jobsh delete doctor schedule")
        await doctorSchedule.deleteDoctorSchedule()
        //console.log("[LOGD] jobsh get doctor schedule")
        retryFlags = await doctorSchedule.getDoctorSchedule()
        
        console.log('--------> retry loop no '+retry +' retry flag no: '+retryFlags)
        if(retryFlags == 0) {
            break
        }
        retry--
    }
    if(retryFlags == 0){
        console.log("[LOGD] jobsh validate new doctor schedule")
        await doctorSchedule.validateNewDoctorSchedule()
        await doctorSchedule.retrieveData()
    }

    //await doctorSchedule.counterCheck()
    await doctorSchedule.retrieveData()

    await patientAppointment.retrieveDataTest()
    await careProService.retrieveDataTest()
}

const taskIntervalGetDataFromTrakcare = async () => {

    console.log('........... TASK JOBSH INTERVAL '+Date())
    //--------- Patient Appointment ----------
    console.log("[LOGD] jobsh delete apointment")
    await patientAppointment.deletePatientAppointment()
    console.log("[LOGD] jobsh get apointment")
    await patientAppointment.getPatientAppointment()
    console.log("[LOGD] jobsh new apointment")
    await patientAppointment.validateNewAppointment()
    console.log("[LOGD] jobsh update apointment")
    await patientAppointment.validateUpdateAppointment()

}

module.exports = {
    taskGetMasterDataFromTrakcare,
    taskIntervalGetDataFromTrakcare
}
