const fs = require('fs')
const https = require('https');
const path = require('path');
const cheerio = require('cheerio')

const siteMap = {
    'arduino': 'www.arduino.cc',
    'github': 'https://github.com'
}

async function genSiteInfoFile() {
    console.log('gen url site info json')
    let siteInfo = {};
  
    console.log(Object.entries(siteMap))
    for (const [site, url] of Object.entries(siteMap)) {
        console.log('Key:', site);
        console.log('Value:', url);
        var isUrl = false;
        isUrl = url.startsWith('http') || url.startsWith('https');
    
        var result;
        const cleanedUrl = url.replace(/^https?:\/\//i, '');
        result = await fetchData('https://' + cleanedUrl);
        result.fqdn = cleanedUrl;

        if (!(result.iconHref).startsWith('http') && !(result.iconHref).startsWith('https')) {
            let iconUrl = 'https://' + cleanedUrl + '/' + result.iconHref;
            await fetchImage(iconUrl)
            result.iconHref = '/images/' + result.iconHref
            console.log('icon: ', result.iconHref)
        }
        result.url = 'https://' + cleanedUrl;
        siteInfo[site] = result;
    }

    const content = `const map = ${JSON.stringify(siteInfo)}\nmodule.exports = map`

    let filepath = './scripts/siteInfo.js'
    fs.truncateSync(filepath, 0);
    console.log(filepath)
    fs.writeFileSync(filepath, content);
};
  
genSiteInfoFile();

const dirname = "./themes/zen-theme/source/images";

async function fetchImage(iconHref) {
    const filename = path.basename(iconHref)
    const downloadPath = path.join(dirname, filename);
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(downloadPath)) {
            https.get(iconHref, (response) => {
                if (response.statusCode !== 200) {
                console.error('无法下载文件。');
                return;
                }
            
                const fileStream = fs.createWriteStream(downloadPath);
                response.pipe(fileStream);
            
                fileStream.on('finish', () => {
                fileStream.close();
                console.log('文件下载成功！');
                });
            
            }).on('error', (error) => {
                console.error('文件下载出错：', error);
            });
        } else {
          resolve();
        }
    });
}

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let html = '';
    
      response.on('data', (chunk) => {
        html += chunk;
      });
    
      response.on('end', () => {
        const $ = cheerio.load(html);
        var title = $('title').text();
        title = title.split(/ |:/)[0];
        const iconHref = $('link[rel="icon"]').attr('href');
        var description = $('meta[name="description"]').attr('content');
        if (description.length > 180) {
          description = description.substring(0, 180) + '...'
        } 
        resolve({ title, iconHref, description });
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}