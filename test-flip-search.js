import axios from 'axios';

(async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/scrape-flipkart-search', { query: 'laptop' });
    console.log(res.data);
  } catch (e) {
    if (e.response) {
      console.log(e.response.data);
    } else {
      console.log(e.message);
    }
  }
})();
