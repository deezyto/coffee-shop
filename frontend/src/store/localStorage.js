const typeStorage = 'cookies';
const cookiesToObj = () => {
  return document.cookie.split(';').map(item => item.split('=')).reduce((accumulator, [key, value]) => ({...accumulator, [key.trim()]: value}), {});
}
export const getItem = (name, key, type = typeStorage) => {
  if (type === 'localStorage') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log(e);
    }
  } else if (type === 'cookies') {
    try {
      console.log('cookies')
      console.log(JSON.parse(cookiesToObj()['token']))
      return key ? JSON.parse(cookiesToObj()[name])[key] : JSON.parse(cookiesToObj()[name]);
    } catch {

    }
  }
}

export const removeKey = (name, key, type = typeStorage) => {
  if (type === 'localStorage') {
    try {
      return localStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  } else if (type === 'cookies') {
    try {
      return setItem(name, cookiesToObj().toJSON(() => {
        delete this[key];
        return this;
      }))
    } catch {

    }
  }
}

export const removeItem = (key, type = typeStorage) => {
  if (type === 'localStorage') {
    try {
      return localStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  } else if (type === 'cookies') {
    try {
      setItem(key, 'undefined', type)
    } catch {

    }
  }
}

export const setItem = (key, data, type = typeStorage) => {
  if (type === 'localStorage') {
    try {
      localStorage.setItem(key, data);
    } catch (e) {
      console.log(e);
    }
  } else if (type === 'cookies') {
    try {
      console.log(data, 'setItem')
      document.cookie = `${key}=${JSON.stringify(data)}; SameSite=None; Secure`;
    } catch {
    }
  }
}