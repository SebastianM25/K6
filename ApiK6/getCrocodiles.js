import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    thresholds: {
        http_req_duration: ['p(95) < 800'], 
    },
    vus: 10, 
    duration: '30s', 
};
export default function () {
    let baseUrl = __ENV.BASE_URL || 'https://test-api.k6.io'; // Fallback la URL implicit
    let url = `${baseUrl}/public/crocodiles/`;  

    let res = http.get(url);  

    check(res, {
        'Status code is 200': (r) => r.status === 200,
        'Response time is under 800ms': (r) => r.timings.duration < 800,
        'Response is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
        'Response body is not empty': (r) => r.body.length > 0,
        'Response contains an array': (r) => {
            try {
                let data = JSON.parse(r.body);
                return Array.isArray(data);
            } catch (e) {
                return false;
            }
        },
        'Each crocodile has required properties': (r) => {
            let data = JSON.parse(r.body);
            return data.every(croc => 
                croc.hasOwnProperty('id') &&
                croc.hasOwnProperty('name') &&
                croc.hasOwnProperty('sex') &&
                croc.hasOwnProperty('date_of_birth') &&
                croc.hasOwnProperty('age')
            );
        },
    });

    sleep(1); 
}
