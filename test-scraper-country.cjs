const axios = require('axios');
(async () => {
    try {
        const url = encodeURIComponent("https://www.amazon.in/dp/B0D5D1HNJX");
        const res = await axios.get(`http://api.scraperapi.com?api_key=5d5e88487260af181c9730311f19d12a&country_code=in&premium=true&url=${url}`);
        console.log(res.data.includes("Dell") ? "Success it has Dell" : res.data.substring(0, 500));
    } catch (e) {
        console.error(e.response ? e.response.status : e.message);
    }
})();
