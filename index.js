const axios = require('axios');
const CryptoJS = require('crypto-js');

// lG 函数：过滤特定的请求头部
const lG = (headers) => {
  let filteredHeaders = {};
  for (let key in headers) {
    let lowerKey = key.toLowerCase();
    if (lowerKey.startsWith("x-ca-")
    ) {
      filteredHeaders[lowerKey] = headers[key];
    }
  }
  return filteredHeaders;
};

// nde 函数：生成 HMAC 签名
const nde = ({ method: e, url: t, appSecret: n, accept: r, date: o, contentType: i, params: a, headers: s }) => {
  let l = "";
  // 过滤掉参数对象中的无效键
  let u = {};
  if (a && Object.keys(a).length > 0) {
    Object.keys(a).forEach(p => {
      if (p !== "undefined") {
        u[p] = a[p];
      }
    });
  }
  a = u;
  // 构建签名字符串
  l += `${e}\n`;
  l += `${r}\n`;
  l += `\n`;
  l += `${i}\n`;
  l += `${o}\n`;
  // 处理请求头部
  let c = lG(s);
  let d = Object.keys(c).sort();
  for (let p of d) {
    l += `${p}:${c[p]}\n`;
  }

  // 处理 URL 和参数
  l += ((p, h) => {
    let f = Object.keys(h).sort();
    let g = null;
    for (let m of f) {
      let v;
      if (h[m] !== "" || h[m] === 0) {
        v = `${m}=${h[m]}`;
      } else {
        v = `${m}${h[m]}`;
      }
      g = g ? `${g}&${v}` : v;
    }
    return g ? `${p}?${g}` : p;
  })(t.replace(/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.csdn\.net)/, ""), a);
  // 生成 HMAC 签名
  return CryptoJS.HmacSHA256(l, n).toString(CryptoJS.enc.Base64);
};
const getaa = (requestDetails, nonce) => {
  return { signature: nde(requestDetails), nonce };
}


// 初始化请求配置
const apiKey = '203803574';
const tde = (e) => {
  let t = e || null;
  if (t == null) {
    t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (n) {
      let r = 16 * Math.random() | 0;
      return (n === "x" ? r : (r & 3) | 8).toString(16);
    });
  }
  return t;
};

const list = []
// 发起请求
async function getArticle() {
  const nonce = tde();
  const requestDetails = {
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
  const { signature } = getaa(requestDetails, nonce)
  // 构造请求头
  const headers = {
    // 'authority': 'bizapi.csdn.net',
    // 'accept': '*/*',
    'cookie': `uuid_tt_dd=10_30842400910-1723727293488-268517; fid=20_57291681457-1723727294783-546735; UN=weixin_63115449; Hm_ct_6bcd52f51e9b3dce32bec4a3997715ac=6525*1*10_30842400910-1723727293488-268517!5744*1*weixin_63115449; c_ins_prid=-; c_ins_rid=1730957590836_107148; c_ins_fref=https://blog.csdn.net/m0_64656053/article/details/138110343; c_ins_fpage=/index.html; c_ins_um=-; ins_first_time=1730957674789; ssxmod_itna=WqUxR7Dt0QD=gDBaqeTmbFL2G4R2w+4DKo3DklUDBwb4iNDnD8x7YDv+IsKwQK=Q7W44LeUB+vs6KtfpbvhAj82fOs0Co4GLDmKDyF70HNDx1q0rD74irDDxD3yD7PGmDiWZRD72=1lSgK8DWKDKx0kDY5Dw=AkDYPDWxDFUc0YvQ+kfxi7DD5Dn1Av44DWDWaCwDDzwB3io09YDm+kyca+qUYAdCvYUxG1DQ5Ds=D28SO25NbsycLYuU485zYDvxDktFyHd4Gd2ZHzp=LN=j+x=erN3e2D6jDPoB2pdC+SKjG5pnG78ChimyYRilnbNj0Y3PoiBPeD=; ssxmod_itna2=WqUxR7Dt0QD=gDBaqeTmbFL2G4R2w+4DKo3DklD8T=cqGNRNGaQbvVFtsx8h8znQ4ZQDC9D+K5RL70eoqUChr3YOtuyj1lIKeKHwdS==dpvGuU6L92KawZykvZYD5y9IjutV89uV+f5D2rjZfripbfjrSODMQT2sYE6jQAvT0fYYrTbKX3A4oTRu80tgnTWZKm4du36Yac=esccrrQYFsoA36CysQAx1seE1clEs3w+H3SfhYLAh3ZfvmzfvCQLh0CSHfM3rzoxj315bRm=N08fher1h+hOLwrSbNFCzCCYqiKuvF7H2=e4j=eGwAgdooIKY69E01pUCcDrZL0o=qBYWl+PCNFhqdEqBlqVgLDODRmt9o6/Pq/ZUMa33AiyoIv=ww1U10Qr3QVeqM0UegdkRusDnRWtTrnh3nfBuG7omEowfop2j+CT0ANyZmBZU+ZUU4qIafE/UA8TaDG27eDFqD+=4xD==; tfstk=fuw-azOLMZbl-OtvMB1m-yvElqScSJEyHzr6K20kOrUYJyvoOauovW3Yo7vnF24LAz4eE4iINtijX0iIVLwLgpEaY8jrKgkz4vkCSNXiJurrLPeagPb0cMie13z1IOqz4niGhsJfIe3D5o4SRyGSGEiKl0iIRyTjcqoEAUiBFiIxYqiSApg7cqiEAe9QRvsYcqoIdC_Kl3gHpWAH2cLyPbJBd86EwVLtlmo4H0h-5jgvd7ex2b3_V8fUfcnbn-hiiHfZhlP0PmHOnQM_DWaT1y5MgYEQNylYzZRxoSwzA2GJAdqYXuNshJjBbjUjvfMIMH9QDYuLJ8M1CEn4GuVQUzKpd0yuIX3ZMM9Etxwi15aJYGrjFDaE_JbwU4ZQbRPiBtASCoFQWWIPwR2T2JYiWDA5DideTbi45NEVG_kymqoxSgBpTBlV0m3GDiABOesjDVjR4BREgRC..; UserName=weixin_63115449; UserInfo=4dafd0885ee748d6893ec147390c91f6; UserToken=4dafd0885ee748d6893ec147390c91f6; UserNick=%E6%9C%9D%E9%98%B3581; AU=92A; BT=1739320754350; p_uid=U010000; c_dl_um=-; csdn_newcert_weixin_63115449=1; _ga_JJBD2VG1H7=GS1.1.1742453984.11.0.1742453984.60.0.0; __gads=ID=5bc2c182ffe397ce:T=1728374564:RT=1744713708:S=ALNI_MaB-hJNY9yMO5pqB6JXk17BsRv7XA; __gpi=UID=00000f399d5f1b6f:T=1728374564:RT=1744713708:S=ALNI_MbLkltEAntvNfu-JpJnpljwSJPzgg; __eoi=ID=e1f9667fa6f4d050:T=1744713708:RT=1744713708:S=AA-AfjYY6irLW7XAqKmduO92Q_Ck; FCNEC=%5B%5B%22AKsRol-7IrDi_INMAKeHhCXhAKchZ361yySm5HFzRTvceKPJ0zAX7bHDag2gwuS51xKyfAPnCGnCQa6o89wW4P5mbhpuur3qTvKiP94AKuWoL3iSV2RNpIS0eFtcAAEc1r9gZ7154TqyMiWP8H7j_3hislz52Yj0-A%3D%3D%22%5D%5D; c_adb=1; c_dl_prid=1742374461700_396862; c_dl_rid=1745488275955_479979; c_dl_fref=https://www.baidu.com/link; c_dl_fpage=/download/u010479989/90622092; c_segment=5; Hm_lvt_6bcd52f51e9b3dce32bec4a3997715ac=1745394313,1745716962,1745731250,1745979763; HMACCOUNT=3DAA227F365E58CE; dc_sid=41ee046f1d7ec45d8be885d224054bc4; _gid=GA1.2.1032662137.1746586842; _clck=1wvnxog%7C2%7Cfvp%7C0%7C1688; creative_btn_mp=3; is_advert=1; c_page_id=default; _ga=GA1.1.1988823727.1723727297; _clsk=s8urdx%7C1746603914400%7C5%7C0%7Cf.clarity.ms%2Fcollect; _ga_7W1N0GEY1P=GS2.1.s1746602096$o631$g1$t1746603940$j32$l0$h0; dc_session_id=10_1746606003111.476159; c_first_ref=default; c_first_page=https%3A//www.csdn.net/; c_dsid=11_1746606005229.945702; c-sidebar-collapse=0; c_ab_test=1; creativeSetApiNew=%7B%22toolbarImg%22%3A%22https%3A//img-home.csdnimg.cn/images/20230921102607.png%22%2C%22publishSuccessImg%22%3A%22https%3A//img-home.csdnimg.cn/images/20240229024608.png%22%2C%22articleNum%22%3A43%2C%22type%22%3A2%2C%22oldUser%22%3Atrue%2C%22useSeven%22%3Afalse%2C%22oldFullVersion%22%3Atrue%2C%22userName%22%3A%22weixin_63115449%22%7D; log_Id_click=7; c_pref=https%3A//i.csdn.net/; c_ref=https%3A//mpbeta.csdn.net/; log_Id_view=132; log_Id_pv=14; dc_tos=svvtvn; Hm_lpvt_6bcd52f51e9b3dce32bec4a3997715ac=1746606083`, // 需替换有效cookie
    // 'origin': 'https://editor.csdn.net',
    // 'referer': 'https://editor.csdn.net/',
    'x-ca-key': apiKey,
    'x-ca-nonce': nonce,
    'x-ca-signature': signature, // 需要获取实际签名密钥
    "x-ca-signature-headers": "x-ca-key,x-ca-nonce",
  };
  try {
    const response = await axios.get(
      `
https://bizapi.csdn.net/blog/phoenix/console/v1/article/list?page=1&status=all_v2&pageSize=100`,
      {

        headers: headers
      }
    );
    response.data.data.list.forEach(item => {
      list.push({ id: item.articleId, postTime: item.postTime, title: item.title })
    })
  } catch (error) {
    console.error('请求失败:', error.response?.data || error.message);
  }
}

getArticle().then(() => {
  console.log('文章列表:', list);
})



async function getArticleDetail(id) {
  const nonce = tde();
  const requestDetails = {
    method: 'GET',
    url: '/blog-console-api/v3/editor/getArticle',
    appSecret: '9znpamsyl2c7cdrr9sas0le9vbc3r6ba',
    accept: 'application/json, text/plain, */*',
    date: '',
    contentType: '',
    params: {
      id: id,
      model_type: ""
    },
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "",
      "X-Ca-Key": "203803574",
      'X-Ca-Nonce': nonce
    }
  };
  const { signature } = getaa(requestDetails, nonce)
  const headers1 = {
    // 'authority': 'bizapi.csdn.net',
    // 'accept': '*/*',
    'cookie': `uuid_tt_dd=10_30842400910-1723727293488-268517; fid=20_57291681457-1723727294783-546735; UN=weixin_63115449; Hm_ct_6bcd52f51e9b3dce32bec4a3997715ac=6525*1*10_30842400910-1723727293488-268517!5744*1*weixin_63115449; c_ins_prid=-; c_ins_rid=1730957590836_107148; c_ins_fref=https://blog.csdn.net/m0_64656053/article/details/138110343; c_ins_fpage=/index.html; c_ins_um=-; ins_first_time=1730957674789; ssxmod_itna=WqUxR7Dt0QD=gDBaqeTmbFL2G4R2w+4DKo3DklUDBwb4iNDnD8x7YDv+IsKwQK=Q7W44LeUB+vs6KtfpbvhAj82fOs0Co4GLDmKDyF70HNDx1q0rD74irDDxD3yD7PGmDiWZRD72=1lSgK8DWKDKx0kDY5Dw=AkDYPDWxDFUc0YvQ+kfxi7DD5Dn1Av44DWDWaCwDDzwB3io09YDm+kyca+qUYAdCvYUxG1DQ5Ds=D28SO25NbsycLYuU485zYDvxDktFyHd4Gd2ZHzp=LN=j+x=erN3e2D6jDPoB2pdC+SKjG5pnG78ChimyYRilnbNj0Y3PoiBPeD=; ssxmod_itna2=WqUxR7Dt0QD=gDBaqeTmbFL2G4R2w+4DKo3DklD8T=cqGNRNGaQbvVFtsx8h8znQ4ZQDC9D+K5RL70eoqUChr3YOtuyj1lIKeKHwdS==dpvGuU6L92KawZykvZYD5y9IjutV89uV+f5D2rjZfripbfjrSODMQT2sYE6jQAvT0fYYrTbKX3A4oTRu80tgnTWZKm4du36Yac=esccrrQYFsoA36CysQAx1seE1clEs3w+H3SfhYLAh3ZfvmzfvCQLh0CSHfM3rzoxj315bRm=N08fher1h+hOLwrSbNFCzCCYqiKuvF7H2=e4j=eGwAgdooIKY69E01pUCcDrZL0o=qBYWl+PCNFhqdEqBlqVgLDODRmt9o6/Pq/ZUMa33AiyoIv=ww1U10Qr3QVeqM0UegdkRusDnRWtTrnh3nfBuG7omEowfop2j+CT0ANyZmBZU+ZUU4qIafE/UA8TaDG27eDFqD+=4xD==; tfstk=fuw-azOLMZbl-OtvMB1m-yvElqScSJEyHzr6K20kOrUYJyvoOauovW3Yo7vnF24LAz4eE4iINtijX0iIVLwLgpEaY8jrKgkz4vkCSNXiJurrLPeagPb0cMie13z1IOqz4niGhsJfIe3D5o4SRyGSGEiKl0iIRyTjcqoEAUiBFiIxYqiSApg7cqiEAe9QRvsYcqoIdC_Kl3gHpWAH2cLyPbJBd86EwVLtlmo4H0h-5jgvd7ex2b3_V8fUfcnbn-hiiHfZhlP0PmHOnQM_DWaT1y5MgYEQNylYzZRxoSwzA2GJAdqYXuNshJjBbjUjvfMIMH9QDYuLJ8M1CEn4GuVQUzKpd0yuIX3ZMM9Etxwi15aJYGrjFDaE_JbwU4ZQbRPiBtASCoFQWWIPwR2T2JYiWDA5DideTbi45NEVG_kymqoxSgBpTBlV0m3GDiABOesjDVjR4BREgRC..; UserName=weixin_63115449; UserInfo=4dafd0885ee748d6893ec147390c91f6; UserToken=4dafd0885ee748d6893ec147390c91f6; UserNick=%E6%9C%9D%E9%98%B3581; AU=92A; BT=1739320754350; p_uid=U010000; c_dl_um=-; csdn_newcert_weixin_63115449=1; _ga_JJBD2VG1H7=GS1.1.1742453984.11.0.1742453984.60.0.0; __gads=ID=5bc2c182ffe397ce:T=1728374564:RT=1744713708:S=ALNI_MaB-hJNY9yMO5pqB6JXk17BsRv7XA; __gpi=UID=00000f399d5f1b6f:T=1728374564:RT=1744713708:S=ALNI_MbLkltEAntvNfu-JpJnpljwSJPzgg; __eoi=ID=e1f9667fa6f4d050:T=1744713708:RT=1744713708:S=AA-AfjYY6irLW7XAqKmduO92Q_Ck; FCNEC=%5B%5B%22AKsRol-7IrDi_INMAKeHhCXhAKchZ361yySm5HFzRTvceKPJ0zAX7bHDag2gwuS51xKyfAPnCGnCQa6o89wW4P5mbhpuur3qTvKiP94AKuWoL3iSV2RNpIS0eFtcAAEc1r9gZ7154TqyMiWP8H7j_3hislz52Yj0-A%3D%3D%22%5D%5D; c_adb=1; c_dl_prid=1742374461700_396862; c_dl_rid=1745488275955_479979; c_dl_fref=https://www.baidu.com/link; c_dl_fpage=/download/u010479989/90622092; c_segment=5; Hm_lvt_6bcd52f51e9b3dce32bec4a3997715ac=1745394313,1745716962,1745731250,1745979763; HMACCOUNT=3DAA227F365E58CE; dc_sid=41ee046f1d7ec45d8be885d224054bc4; _gid=GA1.2.1032662137.1746586842; _clck=1wvnxog%7C2%7Cfvp%7C0%7C1688; creative_btn_mp=3; is_advert=1; c_page_id=default; _ga=GA1.1.1988823727.1723727297; _clsk=s8urdx%7C1746603914400%7C5%7C0%7Cf.clarity.ms%2Fcollect; _ga_7W1N0GEY1P=GS2.1.s1746602096$o631$g1$t1746603940$j32$l0$h0; dc_session_id=10_1746606003111.476159; c_first_ref=default; c_first_page=https%3A//www.csdn.net/; c_dsid=11_1746606005229.945702; c-sidebar-collapse=0; c_ab_test=1; creativeSetApiNew=%7B%22toolbarImg%22%3A%22https%3A//img-home.csdnimg.cn/images/20230921102607.png%22%2C%22publishSuccessImg%22%3A%22https%3A//img-home.csdnimg.cn/images/20240229024608.png%22%2C%22articleNum%22%3A43%2C%22type%22%3A2%2C%22oldUser%22%3Atrue%2C%22useSeven%22%3Afalse%2C%22oldFullVersion%22%3Atrue%2C%22userName%22%3A%22weixin_63115449%22%7D; log_Id_click=7; c_pref=https%3A//i.csdn.net/; c_ref=https%3A//mpbeta.csdn.net/; log_Id_view=132; log_Id_pv=14; dc_tos=svvtvn; Hm_lpvt_6bcd52f51e9b3dce32bec4a3997715ac=1746606083`, // 需替换有效cookie
    // 'origin': 'https://editor.csdn.net',
    // 'referer': 'https://editor.csdn.net/',
    'x-ca-key': apiKey,
    'x-ca-nonce': nonce,
    'x-ca-signature': signature, // 需要获取实际签名密钥
    "x-ca-signature-headers": "x-ca-key,x-ca-nonce",
  };
  try {
    const response = await axios.get(
      `
https://bizapi.csdn.net/blog-console-api/v3/editor/getArticle?id=${id}&model_type=`,
      {

        headers: headers1
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('请求失败:', error.response?.data || error.message);
  }
}

// async function main() {
//   // 创建连接池（需替换真实凭证）
//   const pool = mysql.createPool({
//     host: 'api.chaoyang1024.top',
//     port: 9906,
//     user: 'root',
//     password: "zhuzhongqian@123456",
//     database: 'csdn',
//     waitForConnections: true,
//     connectionLimit: 10,
//     charset: 'utf8mb4'
//   });
//   async function migrateArticles() {
//     const connection = await pool.getConnection();
//     await connection.beginTransaction();

//     try {
//       await getArticle()
//       console.log('获取到文章总数:', list.length);

//       for (const { id, postTime } of list) {
//         try {
//           const data = await getArticleDetail(id);
//           console.log(`处理文章 ID: ${id}`, data.title);
//           console.log('文章详情:', data);
//           // 字段预处理
//           const insertData = {
//             article_id: data.article_id,
//             title: data.title.substring(0, 255),
//             description: data.description || '',
//             content: data.content,
//             markdowncontent: data.markdowncontent,
//             tags: (data.tags || '').substring(0, 255),
//             categories: data.categories || 'default',
//             type: data.type || 'original',
//             status: Number.isInteger(data.status) ? data.status : 1,
//             created_at: postTime
//           };

//           // // 字段验证
//           // if (!insertData.article_id) {
//           //     throw new Error(`无效的article_id: ${insertData.article_id}`);
//           // }

//           // // 执行插入
//           // const [result] = await connection.query(
//           //     'INSERT INTO articles SET ?',
//           //     insertData
//           // );

//           // console.log(`插入成功 ID: ${result.insertId}`);
//         } catch (err) {
//           console.error(`处理文章 ${id} 失败:`, err);
//           throw err; // 抛出错误终止循环
//         }
//       }

//       await connection.commit();
//       console.log('所有文章迁移完成');
//     } catch (err) {
//       await connection.rollback();
//       console.error('迁移过程失败，已回滚:', err);
//       throw err;
//     } finally {
//       connection.release();
//       pool.end(); // 在所有操作完成后关闭连接池
//     }
//   }

//   migrateArticles()
//     .catch(err => {
//       console.error('全局捕获错误:', err);
//       process.exit(1);
//     });
//   // getArticle().then(() => {

//   //     console.log('文章列表:', list);
//   //     list.forEach(({ id, postTime }) => {
//   //         getArticleDetail(id).then(async (data) => {
//   //             // console.log('文章详情:', data);
//   //             // 处理特殊字段
//   //             const insertData = {
//   //                 article_id: data.article_id,
//   //                 title: data.title.substring(0, 255), // 防止超长
//   //                 description: data.description,
//   //                 content: data.content,
//   //                 markdowncontent: data.markdowncontent,
//   //                 tags: data.tags.substring(0, 255),
//   //                 categories: data.categories,
//   //                 type: data.type || 'original',
//   //                 status: Number(data.status) || 1,
//   //                 created_at: postTime,
//   //                 // read_type: data.read_type || 'public',
//   //                 // reason: data.reason || '',
//   //                 // resource_url: data.resource_url || '',
//   //                 // resource_id: data.resource_id || '',
//   //                 // original_link: data.original_link || '',
//   //                 // authorized_status: Boolean(data.authorized_status),
//   //                 // check_original: Boolean(data.check_original),
//   //                 // editor_type: Number(data.editor_type) || 1,
//   //                 // plan: JSON.stringify(data.plan || []),
//   //                 // vote_id: Number(data.vote_id) || 0,
//   //                 // scheduled_time: Number(data.scheduled_time) || 0,
//   //                 // level: String(data.level || '1'),
//   //                 // cover_type: data.cover_type || '1',
//   //                 // cover_images: JSON.stringify(data.cover_images || []),
//   //                 // created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
//   //             };

//   //             // 执行插入
//   //             const [result] = await pool.query(
//   //                 `INSERT INTO articles SET ?`,
//   //                 insertData
//   //             );

//   //             console.log('插入成功，ID:', result.insertId);
//   //             await pool.end();
//   //         })
//   //     })

//   //     // list.forEach((item) => {
//   //     //     getArticleDetail(item).then(() => {
//   //     //         console.log('文章详情:', item);
//   //     //     })
//   //     // })
//   // })

// }


// main().catch(console.error);