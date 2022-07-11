import axios from "axios";
const baseUrl = "/api/users";

const getAll = async () => {
  console.log("Calling getAll users");
  const response = await axios.get(baseUrl);
  return response.data;
};

const get = async (id) => {
  const url = `${baseUrl}/${id}`;
  const response = await axios.get(url);
  return response.data;
};

const userService = { getAll, get };
export default userService;
