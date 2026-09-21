const net = require('net');
const tls = require('tls');

const host = 'smtp.gmail.com';
const port = 587;

function log(...args) { console.log(...args); }

const socket = net.createConnection({ host, port }, () => {
  log('--- TCP CONNECTED ---');
  // Send EHLO to get capabilities
  socket.write('EHLO localhost\r\n');
});

socket.setEncoding('utf8');

let dataBuffer = '';

socket.on('data', (chunk) => {
  dataBuffer += chunk;
  // Look for server capability line indicating STARTTLS is supported
  if (dataBuffer.includes('250-STARTTLS')) {
    log('Server supports STARTTLS, issuing STARTTLS command');
    socket.write('STARTTLS\r\n');
    // After sending STARTTLS, upgrade to TLS using the same socket
    socket.removeAllListeners('data');
    const tlsSocket = tls.connect({
      socket: socket,
      servername: host,
      rejectUnauthorized: true,
    }, () => {
      log('--- TLS CONNECTED ---');
      log('authorized:', tlsSocket.authorized);
      if (!tlsSocket.authorized) {
        log('authorizationError:', tlsSocket.authorizationError);
      }
      const cert = tlsSocket.getPeerCertificate(true);
      log('subject:', cert.subject);
      log('issuer:', cert.issuer);
      log('valid_from:', cert.valid_from);
      log('valid_to:', cert.valid_to);
      log('subjectAltName:', cert.subjectaltname);
      tlsSocket.end();
    });
    tlsSocket.on('error', (err) => {
      log('--- TLS ERROR ---');
      console.error(err);
    });
  }
});

socket.on('error', (err) => {
  log('--- TCP ERROR ---');
  console.error(err);
});

socket.on('end', () => {
  log('--- TCP END ---');
});
