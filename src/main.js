
function supportLanguages() {
    return ['auto', 'zh-Hans', 'en', 'it', 'nl', 'fr', 'de', 'es', 'ja', 'ko', 'ru', 'pt', 'pl'];
}

function nameUpper(str) {
    return str.toLowerCase().split('_').map(item => {
        return item.replace(item.charAt(0), item[0].toUpperCase())
    }).join('_')
}

function nameTranslate(str) {
    var name = { organization: "组织", ip: "IP", country_code: "国家代码", country: "国家", region_code: "地区代码", region: "地区", city: "城市", postal_code: "邮政编码", continent_code: "洲代码", latitude: "纬度", longitude: "经度", timezone: "时区", asn: "自治系统号", isp: "网络提供商", asn_organization: "自治系统号组织", offset: "偏移量" };
    return name[str];
}

function buildResult(data) {
    var addtions = [];
    for (var item in data) {
        addtions.push({ "name": nameTranslate(item), "value": data[item] });
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
