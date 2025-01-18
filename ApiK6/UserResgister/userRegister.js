import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
  stages: [
    { duration: '1m', target: 5 }, // 5 users over 1 minute
  ],
};

export default function () {
    let baseUrl = __ENV.BASE_URL || 'https://test-api.k6.io'; // Fallback URL implicit
    const url = `${baseUrl}/user/register/`;
    
    const payload = JSON.stringify({
        username: randomString(8), 
        first_name: `First${randomString(4)}`,
        last_name: `Last${randomString(4)}`,
        email: `${randomString(5)}@example.com`,
        password: randomString(10),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'response time is under 5s': (r) => r.timings.duration < 5000,
    });

    sleep(1); 
};
