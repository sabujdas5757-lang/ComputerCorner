const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/scrape-product', {
      url: "https://www.amazon.in/dp/B0CX585KV2"
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error Status:", err.response.status);
      console.log("Error Data:", err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
})();
