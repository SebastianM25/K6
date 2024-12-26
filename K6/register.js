import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10, // number of virtual users
  duration: '30s', // duration of the test
};

export default function () {
  // Define the URL and request payload
  const url = 'https://example.com/api/data';
  const payload = JSON.stringify({
    name: 'John Doe',
    email: 'johndoe@example.com',
    age: 30,
  });

  // Define headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // if you need authentication
  };

  // Make the POST request
  const res = http.post(url, payload, { headers: headers });

  // Validate response status code
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
