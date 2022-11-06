import { storeData, getData, deleteById } from '../../utils/localStorage';
import { ADD_UPDATE_USER, DELETE_USER, GET_USER } from '../Types';

const initState = {
  list: [],
  selectedUser: {},
};

const reducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER:
      return {
        ...state,
        list: getData(),
      };
    case ADD_UPDATE_USER:
      storeData(payload);
      return {
        ...state,
        list: getData(),
      };
    case DELETE_USER:
      deleteById(payload);
      return {
        ...state,
        list: getData(),
      };
    default:
      return state;
  }
};

export default reducer;
