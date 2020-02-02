import { fetch as fetchPro } from "whatwg-fetch";
import qs from "qs";
import Cookies from "js-cookie";
console.log(Cookies.get('67ae207794a5fa18fff94e9b62668e5c'))
const get = (url, data) => {
    if (data) {
        var str = "";
        for (var key in data) {
            str += "&" + key + "=" + data[key];
        }

        url = url + "?" + str.slice(1);
    }
    var result = fetchPro(url, {
        credentials: "include",
        headers: {
            "content-type": "application/json",
            'token':Cookies.get('67ae207794a5fa18fff94e9b62668e5c')
        }
    }
    ).then(res => res.json());
    return result;
}
const post = (url, data) => {
    var result = fetchPro(url, {
        method: "post",
        credentials: "include",
        headers: {
            "content-type": "application/json",
            'token':Cookies.get('67ae207794a5fa18fff94e9b62668e5c')
        },
        body: JSON.stringify(data)
    }).then(res=>res.json())
    return result;
}


export default {
    get,
    post
}