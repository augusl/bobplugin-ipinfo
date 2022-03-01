
function supportLanguages() {
    return ['auto', 'zh-Hans', 'en', 'it', 'nl', 'fr', 'de', 'es', 'ja', 'ko', 'ru', 'pt', 'pl'];
}

function nameUpper(str) {
    return str.toLowerCase().split('_').map(item => {
        return item.replace(item.charAt(0), item[0].toUpperCase())
    }).join('_')
}

function buildResult(data) {
    var addtions = [];
    for (var item in data) {
        addtions.push({ "name": nameUpper(item), "value": data[item] });
    }
    var result = {
        "from": "en",
        "to": "en",
        "fromParagraphs": [],
        "toParagraphs": [data.ip],
        "toDict": {
            "addtions": addtions
        }
    }
    return result;
}

function translate(query, completion) {
    var ip = "";
    var keywords = ['local', 'ip'];
    if (keywords.indexOf(query.text.toLowerCase()) === -1) {
        ip = query.text.trim().replace(/\s/g, ".");
    }
    $http.get({
        url: "https://api.ip.sb/geoip/" + encodeURIComponent(ip),
        handler: function (resp) {
            if (resp.data.code !== undefined) {
                completion({ 'error': { 'type': 'unsupportLanguage', 'message': resp.data.message, 'addtion': JSON.stringify(resp.data) } });
            } else {
                completion({ 'result': buildResult(resp.data) });
            }
        }
    });
}
