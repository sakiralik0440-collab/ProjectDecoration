const tls = require('tls');

const options = {
  host: 'smtp.gmail.com',
  port: 587,
  servername: 'smtp.gmail.com',
  rejectUnauthorized: false, // diagnostic only
};

const socket = tls.connect(options, () => {
  console.log('--- TLS CONNECTED (diagnostic) ---');
  const cert = socket.getPeerCertificate(true);
  console.log('subject:', cert.subject);
  console.log('issuer:', cert.issuer);
  console.log('valid_from:', cert.valid_from);
  console.log('valid_to:', cert.valid_to);
  console.log('subjectAltName:', cert.subjectaltname);
  socket.end();
});

socket.on('error', (err) => {
  console.error('--- CONNECTION ERROR ---');
  console.error(err);
});
