import axiosInstance from "@/lib/axios";

const getAllUsersApi = async () => {
  const response = await axiosInstance.get("/user/user-list");
    return response.data;
}

const getUserByIdApi = async (userId: string) => {
  const response = await axiosInstance.get(`/user/${userId}`);
  return response.data;
}

const deleteUserApi = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/${userId}`);
  return response.data;
}

export { getAllUsersApi, getUserByIdApi, deleteUserApi };