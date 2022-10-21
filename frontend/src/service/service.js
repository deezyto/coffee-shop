
class Service {
  _apiBase = 'http://127.0.0.1:5025';
  _headers = {'Content-Type': 'application/json'};

  getResource = async (url, method = 'GET', body = null, headers = this._headers) => {
    const result = await fetch(url, {method, body, headers});

    if (!result.ok) {
      throw new Error(`Could not fetch for ${url}, status: ${result.status}`)
    }

    return await result.json();
  }

  userLogin = async (body, headers = {}) => {
    const result = await this.getResource(`${this._apiBase}/users/login`, 'POST', JSON.stringify(body), {...this._headers, ...headers})
    return result;
  }

  userLogout = async (headers = {}) => {
    const result = await this.getResource(`${this._apiBase}/users/logout`, 'POST', null, {...this._headers, ...headers})
    return result;
  }

  userChangeFieldProfile = async (body, headers = {}) => {
    return await this.getResource(`${this._apiBase}/users/me`, 'PUT', JSON.stringify(body), {...this._headers, ...headers})
  }

  adminGetItems = async (path, headers = {}) => {
    return await this.getResource(`${this._apiBase}${path}`, 'GET', null, {...this._headers, ...headers})
  }

  adminGetUsers = async (path, headers = {}) => {
    return await this.getResource(`${this._apiBase}${path}`, 'GET', null, {...this._headers, ...headers})
  }

}

export default Service;