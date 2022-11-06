import axios from 'axios';

export const fetchColleges = async (name) => {
  const API_URL = 'http://universities.hipolabs.com/search?name=';
  try {
    return await axios
      .get(API_URL + name)
      .then((res) => res)
      .catch((err) => err);
  } catch (err) {
    return err;
  }
};
