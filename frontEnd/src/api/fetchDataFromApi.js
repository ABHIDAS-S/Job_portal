import { api } from "./api";

export const fetchDataFromApi = async (url, params, token) => {
  try {
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const { data } = await api.get(url, config);
    return data;
  } catch (error) {
    console.log(error);
    throw error; // Throw error so that it can be caught by the caller
  }
};
