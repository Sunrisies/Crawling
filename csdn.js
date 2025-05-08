const axios = require('axios');
const CryptoJS = require('crypto-js');

// 过滤特定请求头部
const filterHeaders = (headers) => {
    const filteredHeaders = {};
    for (const key in headers) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.startsWith("x-ca-")) {
            filteredHeaders[lowerKey] = headers[key];
        }
    }
    return filteredHeaders;
};

// 生成 HMAC 签名
const generateSignature = ({ method, url, appSecret, accept, date, contentType, params, headers }) => {
    let signatureString = `${method}\n${accept}\n\n${contentType}\n${date}\n`;

    // 处理请求头部
    const filteredHeaders = filterHeaders(headers);
    const sortedHeaderKeys = Object.keys(filteredHeaders).sort();
    for (const key of sortedHeaderKeys) {
        signatureString += `${key}:${filteredHeaders[key]}\n`;
    }

    // 处理 URL 和参数
    const processedUrl = url.replace(/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.csdn\.net)/, "");
    const urlParams = new URLSearchParams();
    const sortedParamKeys = Object.keys(params).sort();
    for (const key of sortedParamKeys) {
        urlParams.append(key, params[key]);
    }
    signatureString += urlParams.toString() ? `${processedUrl}?${urlParams.toString()}` : processedUrl;

    // 生成 HMAC 签名
    return CryptoJS.HmacSHA256(signatureString, appSecret).toString(CryptoJS.enc.Base64);
};

// 获取签名和随机数
// const getSignatureAndNonce = (requestDetails) => {
//     return { signature: generateSignature(requestDetails) };
// };

// 生成随机数
const generateNonce = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = (16 * Math.random()) | 0;
        return (char === "x" ? random : (random & 3) | 8).toString(16);
    });
};

// 发起请求
async function fetchCSDNArticles() {
    const nonce = generateNonce();
    const apiConfig = {
        method: 'GET',
        url: 'https://bizapi.csdn.net/blog/phoenix/console/v1/article/list',
        appSecret: '9znpamsyl2c7cdrr9sas0le9vbc3r6ba',
        accept: 'application/json, text/plain, */*',
        date: '',
        contentType: '',
        params: {
            page: 1,
            pageSize: 100,
            status: "all_v2"
        },
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "",
            "X-Ca-Key": "203803574",
            'X-Ca-Nonce': nonce
        }
    };

    const signature = generateSignature(apiConfig);

    const requestHeaders = {
        'cookie': ` UserName=weixin_63115449; UserToken=4dafd0885ee748d6893ec147390c91f6; UserNick=%E6%9C%9D%E9%98%B3581;___`, // 需替换有效cookie
        'x-ca-key': apiConfig.headers['X-Ca-Key'],
        'x-ca-nonce': nonce,
        'x-ca-signature': signature,
        "x-ca-signature-headers": "x-ca-key,x-ca-nonce",
    };

    try {
        const response = await axios.get(apiConfig.url, {
            headers: requestHeaders,
            params: apiConfig.params
        });

        const articles = response.data.data.list.map(item => ({
            id: item.articleId,
            postTime: item.postTime,
            title: item.title
        }));

        return articles;
    } catch (error) {
        console.error('请求失败:', error.response?.data || error.message);
        return [];
    }
}

// 使用示例
fetchCSDNArticles().then(articles => {
    console.log('文章列表:', articles);
});