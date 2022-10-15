
const initialState = {currentProfilePage: null, panelOpen: false}

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
    case 'PANEL STATUS':
      return {
        ...state,
        panelOpen: !state.panelOpen
      }
    case null:
      return {
        ...state,
        currentProfilePage: null
      }
    default:
      return state;
  }
}

export default reducer;