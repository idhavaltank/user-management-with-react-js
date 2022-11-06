import {  ADD_UPDATE_USER, DELETE_USER, GET_USER } from '../Types';

export const getUser = () => ({
  type: GET_USER,
});
export const addUpdateUser = (data) => ({
  type: ADD_UPDATE_USER,
  payload: data,
});

export const removeUser = (userId) => ({
  type: DELETE_USER,
  payload: userId,
});
