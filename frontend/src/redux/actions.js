export const setPageName = (pageName) => ({type: pageName});
export const setPanelStatus = () => ({type: 'PANEL STATUS'});
export const setTypeUserForm = (formName) => ({type: formName});
export const loginFetching = () => ({type: 'LOGIN_FETCHING'});
export const loginFetched = () => ({type: 'LOGIN_FETCHED'});
export const loginFetchingErr = () => ({type: 'LOGIN_FETCHING_ERR'});
export const isLogin = (status) => ({type: 'ISLOGIN', payload: status});
export const setAuthToken = (status) => ({type: 'AUTH_TOKEN', payload: status});