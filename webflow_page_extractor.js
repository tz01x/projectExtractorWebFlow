const fs = require('fs');
const https = require('https');
const obj = require('./test.json');
const BASE_DIR="./projExt"
fs.writeFileSync(getPath(`css/${obj.cssFileName}`),obj.css);
fs.writeFileSync(getPath('css/normalize.css'),obj.cssNormalize);

obj.pages.forEach(pageObj => {
    fs.writeFileSync(getFileName(pageObj),pageObj.html);
    Object.keys(pageObj.renderData.assets).forEach((key)=>{
        const asset = pageObj.renderData.assets[key];
        downloadAsset(key,asset.cdnUrl);
    })

});


function getPath(filename){
    return `${BASE_DIR}/${filename}`
}

function getFileName(objPage){
    return getPath(
        objPage?.renderData?.page?.title.toLowerCase().split(" ").join("_")+".html"
    )
}

function downloadAsset(key,url){
    let filename = key;
    const items = url.split(key);
    if(items.length>1){
        filename = items[1].slice(1) 
    }else{
        filename+=".jpg"
    }
    https.get(url,(res) => {
        const path = getPath(`assets/${filename}`)
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish',() => {
            filePath.close();
            console.log('Download Completed'); 
        })
    })
}

console.log('project extract')