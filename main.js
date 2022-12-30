const fs = require('fs');
const https = require('https');
const obj = require('./webflow_json_obj.json');

const BASE_DIR="./projExt"

fs.writeFileSync(getPath('css/',obj.cssFileName),obj.css);
fs.writeFileSync(getPath('css/','normalize.css'),obj.cssNormalize);
fs.writeFileSync(getPath('js/',obj.siteJsFileName),obj.siteJs);

obj.pages.forEach(pageObj => {
    fs.writeFileSync(getFileName(pageObj),pageObj.html);
    Object.keys(pageObj.renderData.assets).forEach((key)=>{
        const asset = pageObj.renderData.assets[key];
        downloadAsset(key,asset.cdnUrl);
    })

});


function getPath(relative_path,filename){
    const dir_path = `${BASE_DIR}/${relative_path}`
    if(!fs.existsSync(dir_path)){
        fs.mkdirSync(dir_path,{ recursive: true })
    }
    return `${dir_path}${filename}`
}

function getFileName(objPage){
    return getPath(
        '',
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
    console.log("downloading",filename)
    https.get(url,(res) => {
        const path = getPath('assets/',filename)
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on('finish',() => {
            filePath.close();
            console.log(filename+' download Completed'); 
        })
    })
}

console.log('project extract')