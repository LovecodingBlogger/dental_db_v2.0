const axios = require('axios');
const token = require('./accessToken');

const Authorization = async(req, res) => {

    var json = req.body;
    console.log(json)
	if(json.username==undefined||json.username==""||json.password==undefined||json.password==""){
		res.status(400).json("wrong").send({"id" : json.id ,"resStatus" : 'Cannot response'})
    }
    
    //get token
    let AUTH_TOKEN = await token.getAccessToken()
    //console.log(AUTH_TOKEN.access_token)

    axios.defaults.headers.common['Authorization'] = 'Bearer '+AUTH_TOKEN.access_token 
    console.log(AUTH_TOKEN.access_token)
    //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    try {
        let response = await axios.get('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/api/PTINF/getLogonTrakcare?input1=02020202&input2=01010101')
        console.log(response)
        if(response.Message != undefined){
			//Access denied
			console.log('Access denied')
			res.json("wrong")
		}else{
			//Signon success
			console.log('Signon success')
			res.json("admin")
        }
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    Authorization
}
