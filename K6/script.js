
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // number of virtual users
  duration: '30s', // duration of the test
};

export default function () {
  // Define the URL
  const url = 'https://test-api.k6.io/public/crocodiles/1/';

  // Define headers, if needed (e.g., for authentication)
  const headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // if authentication is required
  };

  // Make the GET request
  const res = http.get(url, { headers: headers });

  // Validate the response status code and response time
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Optionally log the response
  console.log('Response status:', res.status);
  console.log('Response body:', res.body);

  // Simulate user think time
  sleep(1);
}

