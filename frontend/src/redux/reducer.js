const initialState = {
  currentProfilePage: null, 
  panelOpen: false, 
  currentUserProfileForm: null,
  userProfileFields: localStorage.getItem('userProfileFields') ? JSON.parse(localStorage.getItem('userProfileFields')) : null,
  loginStatus: 'idle',
  login: localStorage.getItem('login') ? true : false,
  authToken: localStorage.getItem('token') ? localStorage.getItem('token') : false,
  users: [],
  usersLoadingStatus: 'idle',
  admin: false,
  items: [],
  itemsLoadingStatus: 'idle'
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
    case 'CURRENT_USER_PROFILE_FORM':
      return {
        ...state,
        currentUserProfileForm: action.payload
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
        authToken: action.payload
      }
    case 'USER_PROFILE_FIELDS':
      return {
        ...state,
        userProfileFields: action.payload
      }
    case 'USERS_FETCHING':
      return {
        ...state,
        usersLoadingStatus: 'loading'
      }
    case 'USERS_FETCHED':
      return {
        ...state,
        usersLoadingStatus: 'idle',
        users: action.payload
      }
    case 'USERS_FETCHING_ERR':
      return {
        ...state,
        usersLoadingStatus: 'err'
      }
    case 'ITEMS_FETCHING':
      return {
        ...state,
        itemsLoadingStatus: 'loading'
      }
    case 'ITEMS_FETCHED':
      return {
        ...state,
        itemsLoadingStatus: 'idle',
        items: action.payload
      }
    case 'ITEMS_FETCHING_ERR':
      return {
        ...state,
        itemsLoadingStatus: 'err'
      }
    default:
      return state;
  }
}

export default reducer;