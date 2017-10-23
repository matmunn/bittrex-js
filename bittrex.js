var hmac = require('crypto').createHmac,
    axios = require('axios');

function bittrex (key, secret) {
    var self = this;
    self.key = key;
    self.secret = secret;

    var request = function(path) {
        var nonce = new Date().getTime();

        if (path.indexOf('?') === -1) {
            path = `${path}?apikey=${self.key}&nonce=${nonce}`
        } else {
            path = `${path}&apikey=${self.key}&nonce=${nonce}`
        }

        var options = {
            baseURL: 'https://bittrex.com/api/v1.1',
            method: 'get',
            url: path,
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'UTF-8',
                'Content-Type': 'application/json'
            }
        };

        var signedMessage = new hmac('sha512', self.secret);

        signedMessage.update(`${options.baseURL}${options.url}`);

        var sign = signedMessage.digest('hex');

        options.headers.apisign = sign;

        return axios.request(options)
    }

    // Public APIs

    self.getMarkets = () => {
        return request('/public/getmarkets')
    }

    self.getCurrencies = () => {
        return request('/public/getcurrencies')
    }

    self.getTicker = (market) => {
        return request(`/public/getticker?market=${market}`)
    }

    self.getMarketSummaries = () => {
        return request(`/public/getmarketsummaries`)
    }

    self.getMarketSummary = (market) => {
        return request(`/public/getmarketsummary?market=${market}`)
    }

    self.getOrderBook = (market, type) => {
        return request(`/public/getorderbook?market=${market}&type=${type}`)
    }

    self.getMarketHistory = (market) => {
        return request(`/public/getmarkethistory?market=${market}`)
    }

    // Market APIs

    self.buyLimit = (market, quantity, rate) => {
        return request(`/market/buylimit?market=${market}&quantity=${quantity}&rate=${rate}`)
    }

    self.sellLimit = (market, quantity, rate) => {
        return request(`/market/selllimit?market=${market}&quantity=${quantity}&rate=${rate}`)
    }

    self.cancelOrder = (uuid) => {
        return request(`/market/cancel?uuid=${uuid}`)
    }

    self.openOrders = (market = "") => {
        let url = '/market/getopenorders'

        if (market !== "") {
            url = `${url}?market=${market}`
        }

        return request(url)
    }


    // Account APIs

    self.getBalances = () => {
        return request('/account/getbalances');
    }

    self.getBalance = (currency) => {
        return request(`/account/getbalance?currency=${currency}`)
    }

    self.getDepositAddress = (currency) => {
        return request(`/account/getdepositaddress?currency=${currency}`)
    }

    self.withdraw = (currency, quantity, address, note = "") => {
        let url = `/account/withdraw?currency=${currency}&quantity=${quantity}&address=${address}`

        if (note !== "") {
            url = `${url}&paymentid=${note}`
        }

        return request(url)
    }

    self.getOrder = (uuid) => {
        return request(`/account/getorder?uuid=${uuid}`)
    }

    self.getOrderHistory = (market = "") => {
        let url = '/account/getorderhistory'

        if (market !== "") {
            url = `${url}?market=${market}`
        }

        return request(url)
    }

    self.getWithdrawalHistory = (currency = "") => {
        let url = '/account/getwithdrawalhistory'

        if (currency !== "") {
            url = `${url}?currency=${currency}`
        }

        return request(url)
    }

    self.getDepositHistory = (currency = "") => {
        let url = '/account/getdeposithistory'

        if (currency !== "") {
            url = `${url}?currency=${currency}`
        }

        return request(url)
    }
}

module.exports = bittrex;
