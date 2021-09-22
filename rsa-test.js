const crypto = require('crypto');
const https = require('https')

const storedPrivateKey = '';
const storedTempKey = '';

// TODO YOUR APP_NAME HERE:
const app_name = 'webcore';
// TODO YOUR ADMIN API_KEY HERE:
const api_key = ``;
// TODO YOUR EMAIL HERE:
const username = '';
// TODO YOUR PASSWORD HERE:
const pwd = '';

main();

async function main() {
  try {
    const privateKey = await getPrivateKey();
    console.log(`privateKey: ${privateKey}`);
    console.log(`------------------------`);

    const tempKey = await getTempKey();
    console.log(`tempKey: ${tempKey}`);
    console.log(`------------------------`);

    const signature = sign(privateKey, tempKey);
    console.log(`signature: ${signature}`);
    console.log(`------------------------`);

    const result = await loginBySignature(signature);

    console.log('!SUCCESS!');
    console.log(result);
  } catch (e) {
    console.error('ERROR!');
    console.error(e);
  }
}


/**
 *
 * @param privateKey private key that we get from
 * @param tempKey temporary user key
 */
function sign(privateKey, tempKey) {
  const pemKey = `-----BEGIN PRIVATE KEY-----
${privateKey}
-----END PRIVATE KEY-----`;

  const sign = crypto.createSign('RSA-SHA512');
  sign.update(Buffer.from(tempKey));
  return sign.sign(pemKey, 'base64');
}

function getPrivateKey() {
  if (storedPrivateKey) {
    return storedPrivateKey;
  }

  return get(
    `/cloud/json/signatureKey?appName=${app_name}`,
    {
      'API_KEY': api_key,
      'Content-Type': 'application/json'
    }
  )
    .then((data) => data.privateKey);
}

function getTempKey() {
  if (storedTempKey) {
    return storedTempKey;
  }

  return get(
    `/cloud/json/login?appName=${app_name}&username=${username}&sign=true`,
    {
      'Content-Type': 'application/json',
      'PASSWORD': pwd
    }
  )
    .then((data) => data.key);
}

function loginBySignature(signature) {
  return get(
    `/cloud/json/login?appName=${app_name}&username=${username}&sign=true&signAlgorithm=SHA512withRSA`,
    {
      'Content-Type': 'application/json',
      passcode: signature
    }
  );
}

function get(url, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sbox.peoplepowerco.com',
      port: 443,
      path: url,
      method: 'GET',
      headers: headers
    }

    const req = https.request(options, res => {
      res.on('data', d => {
        try {
          const resp = JSON.parse(d);
          if (!d || !resp) {
            reject(d);
          } else if (resp.resultCode !== 0) {
            reject(resp);
          } else {
            resolve(resp);
          }
        } catch (e) {
          reject(e);
        }
      })
    })

    req.on('error', error => {
      reject(error);
    })

    req.end();
  });
}
