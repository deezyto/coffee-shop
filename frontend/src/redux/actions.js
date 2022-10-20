export const setPageName = (pageName) => ({type: pageName});
export const setPanelStatus = () => ({type: 'PANEL STATUS'});
export const setCurrentUserProfileForm = (type = 'CURRENT_USER_PROFILE_FORM', formName) => ({type: type, payload: formName});
export const loginFetching = () => ({type: 'LOGIN_FETCHING'});
export const loginFetched = () => ({type: 'LOGIN_FETCHED'});
export const loginFetchingErr = () => ({type: 'LOGIN_FETCHING_ERR'});
export const isLogin = (status) => ({type: 'ISLOGIN', payload: status});
export const setAuthToken = (status) => ({type: 'AUTH_TOKEN', payload: status});
export const setUserProfileFields = (obj) => ({type: 'USER_PROFILE_FIELDS', payload: obj});