
const initialState = {
  currentProfilePage: null, 
  panelOpen: false, 
  currentUserProfileForm: null,
  loginStatus: 'idle',
  login: false,
  authToken: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETTING':
      return {
        ...state,
        currentProfilePage: 'setting'
      }
    case 'HISTORY':
      return {
        ...state,
        currentProfilePage: 'history'
      }
    case 'ORDERS':
      return {
        ...state,
        currentProfilePage: 'orders'
      }
    case 'WATCH':
      return {
        ...state,
        currentProfilePage: 'watch'
      }
    case 'LOGIN':
      return {
        ...state,
        currentProfilePage: 'login'
      }
    case 'PANEL STATUS':
      return {
        ...state,
        panelOpen: !state.panelOpen
      }
    case 'PAGE HIDE':
      return {
        ...state,
        currentProfilePage: null
      }
    case 'FORM NAME':
      return {
        ...state,
        currentUserProfileForm: 'name'
      }
    case 'FORM SURNAME':
      return {
        ...state,
        currentUserProfileForm: 'surname'
      }
    case 'FORM PASSWORD':
      return {
        ...state,
        currentUserProfileForm: 'password'
      }
    case 'FORM EMAIL':
      return {
        ...state,
        currentUserProfileForm: 'email'
      }
    case 'FORM PHONE':
      return {
        ...state,
        currentUserProfileForm: 'phone'
      }
    case 'FORM CANCEL':
      return {
        ...state,
        currentUserProfileForm: null
      }
    case 'LOGIN_FETCHING':
      return {
        ...state,
        loginStatus: 'loading'
      }
    case 'LOGIN_FETCHED':
      return {
        ...state,
        loginStatus: 'idle'
      }
    case 'LOGIN_FETCHING_ERR':
      return {
        ...state,
        loginStatus: 'err'
      }
    case 'ISLOGIN':
      return {
        ...state,
        login: action.payload
      }
    case 'AUTH_TOKEN':
      return {
        ...state,
        login: action.payload
      }
    default:
      return state;
  }
}

export default reducer;