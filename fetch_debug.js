const http = require('http');
const fs = require('fs');

http.get('http://www.ptpilot.co.kr/forecast/1', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('debug_html.html', data, 'utf8');
        console.log('Saved to debug_html.html');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
