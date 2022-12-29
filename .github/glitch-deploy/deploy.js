const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/blossom-cat-step|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/half-detailed-mongoose|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/animated-equatorial-goldenrod|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/rattle-fork-parrot|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/golden-fuschia-wolfsbane|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/wide-hail-coin|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/tulip-clever-hamburger|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/hazel-nonstop-sternum|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/garnet-opposite-fairy|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/valiant-energetic-bait|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/granite-wax-fish|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/fishy-foam-abrosaurus|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/experienced-confirmed-season|https://8a62a859-3ba1-4815-9e80-c94741d5d531@api.glitch.com/git/sugared-rambunctious-raincoat`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();