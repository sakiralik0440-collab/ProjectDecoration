console.log("SMTP DIAGNOSTIC FILE IS RUNNING");
const tls = require('tls');

console.log('Connecting to smtp.gmail.com:587...');

const socket = tls.connect({
    host: 'smtp.gmail.com',
    port: 587,
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false,
    timeout: 10000,
}, () => {
    console.log('\nTLS CONNECTION SUCCESSFUL');

    const cert = socket.getPeerCertificate(true);

    console.log('\n=== SMTP CERTIFICATE ===');
    console.log('Authorized:', socket.authorized);
    console.log('Authorization Error:', socket.authorizationError);

    console.log('\nSubject:');
    console.log(cert.subject);

    console.log('\nIssuer:');
    console.log(cert.issuer);

    console.log('\nValid From:', cert.valid_from);
    console.log('Valid To:', cert.valid_to);
    console.log('Subject Alternative Name:', cert.subjectaltname);

    socket.end();
});

socket.setEncoding('utf8');

socket.on('data', (data) => {
    console.log('\nSMTP SERVER:', data.trim());
});

socket.on('error', (err) => {
    console.error('\nTLS ERROR:', {
        code: err.code,
        message: err.message,
    });
});

socket.on('timeout', () => {
    console.error('\nTLS TIMEOUT: smtp.gmail.com:587 did not respond within 10 seconds.');
    socket.destroy();
});

socket.on('close', () => {
    console.log('\nConnection closed.');
});
