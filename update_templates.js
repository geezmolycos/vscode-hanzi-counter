const templatesFolder = './templates';
const fs = require('fs');

let templates = {};
let files = fs.readdirSync(templatesFolder);
files.forEach((fileName) => {
    let content = fs.readFileSync(templatesFolder + '/' + fileName, 'utf-8');
    let [name, ext] = fileName.split('.');
    templates[name] = content.split('\n').map(_ => _.trim().split('//')[0]).join('');
});
console.log(templates);

let packagejson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
packagejson.contributes.configuration.properties['vscode-hanzi-counter.counter.templates'].default = {};
for (let t in templates){
    packagejson.contributes.configuration.properties['vscode-hanzi-counter.counter.templates'].default[t] = templates[t];
}
fs.writeFileSync('./package.json', JSON.stringify(packagejson, null, 2), 'utf-8');
