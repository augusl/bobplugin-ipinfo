// Supported languages
function supportLanguages() {
    return ['auto', 'zh-Hans', 'en', 'it', 'nl', 'fr', 'de', 'es', 'ja', 'ko', 'ru', 'pt', 'pl'];
}

// Translate property names
function nameTranslate(str) {
    const translations = {
        organization: "组织",
        ip: "IP",
        country_code: "国家代码",
        country: "国家",
        region_code: "地区代码",
        region: "地区",
        city: "城市",
        postal_code: "邮政编码",
        continent_code: "洲代码",
        latitude: "纬度",
        longitude: "经度",
        timezone: "时区",
        asn: "自治系统号",
        isp: "网络提供商",
        asn_organization: "自治系统组织",
        offset: "偏移量"
    };
    return translations[str];
}

// Build the result object
function buildResult(data) {
    const additions = Object.keys(data).sort().map(item => ({ name: nameTranslate(item), value: `${data[item]}` }));
    return {
        from: "en",
        to: "en",
        fromParagraphs: [data.ip],
        toParagraphs: [data.ip],
        toDict: {
            additions: additions
        }
    };
}

// Translate function
function translate(query, completion) {
    let ip = "";
    const keywords = ['local', 'ip'];
    if (!keywords.includes(query.text.toLowerCase())) {
        ip = query.text.trim().replace(/\s/g, ".");
    }
    $http.get({
        url: "https://api.ip.sb/geoip/" + encodeURIComponent(ip),
        handler: function (resp) {
            if (resp.data.code !== undefined) {
                completion({ error: { type: 'unsupportLanguage', message: resp.data.message, addition: JSON.stringify(resp.data) } });
            } else {
                completion({ result: buildResult(resp.data) });
            }
        }
    });
}
