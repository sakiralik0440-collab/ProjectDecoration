const net = require('net');
const tls = require('tls');

const host = 'smtp.gmail.com';
const port = 587;

function log(...args){ console.log(...args); }

const socket = net.createConnection({host, port}, () => {
  log('--- TCP CONNECTED ---');
  socket.write('EHLO localhost\r\n');
});

let buffer = '';
let stage = 'ehlo'; // stages: ehlo -> starttls -> tls

socket.setEncoding('utf8');

socket.on('data', (chunk) => {
  buffer += chunk;
  // Process lines
  const lines = buffer.split('\r\n');
  // Keep last incomplete line in buffer
  buffer = lines.pop();
  for (const line of lines) {
    if (stage === 'ehlo') {
      // Look for STARTTLS capability
      if (line.includes('250-STARTTLS')) {
        log('Server supports STARTTLS');
        socket.write('STARTTLS\r\n');
        stage = 'starttls';
      }
    } else if (stage === 'starttls') {
      // Expect 220 response
      if (line.startsWith('220')) {
        log('Server ready for TLS, upgrading socket');
        // Upgrade to TLS using the same underlying socket
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
        // After upgrading, stop processing further data on raw socket
        socket.removeAllListeners('data');
        break;
      }
    }
  }
});

socket.on('error', (err) => {
  log('--- TCP ERROR ---');
  console.error(err);
});

socket.on('end', () => {
  log('--- TCP END ---');
});
