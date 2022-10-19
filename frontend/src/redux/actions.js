export const setPageName = (pageName) => ({type: pageName});
export const setPanelStatus = () => ({type: 'PANEL STATUS'});
export const setTypeUserForm = (formName) => ({type: formName});
export const loginFetching = () => ({type: 'LOGIN_FETCHING'});
export const loginFetched = () => ({type: 'LOGIN_FETCHED'});
export const loginFetchingErr = () => ({type: 'LOGIN_FETCHING_ERR'});