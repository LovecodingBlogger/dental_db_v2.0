
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const getAccessToken = async (req, res) => {
    
    let result
    const params = new URLSearchParams();
    params.append('username', 'DENTALDB');
    params.append('password', 'DEN#T$ALD%B');
    params.append('grant_type', 'password');
    await axios.post('https://bhqmdw.bdms.co.th/TEST/DentalDashboardAPI/token', params).then(function (response) {
        // handle success
        result = response.data
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    }); 
    return result
};

module.exports = {
    getAccessToken
}