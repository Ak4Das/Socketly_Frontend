import axiosInstance from "./url.service"

export const sendOtp = async (phoneNumber, phoneSuffix, email, password) => {
  try {
    const response = await axiosInstance.post("/users/send-otp", {
      phoneNumber,
      phoneSuffix,
      email,
      password,
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const verifyOtp = async (phoneNumber, phoneSuffix, otp, email) => {
  try {
    const response = await axiosInstance.post("/users/verify-otp", {
      phoneNumber,
      phoneSuffix,
      otp,
      email,
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const updateUserProfile = async (updateData) => {
  try {
    const response = await axiosInstance.put(
      "/users/update-profile",
      updateData,
    )
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const deleteUser = async (id, password) => {
  try {
    const response = await axiosInstance.delete(
      `/users/delete-user?id=${id}&password=${password}`,
    )
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const checkUserAuth = async () => {
  try {
    const response = await axiosInstance.get("/users/check-auth")
    if (response.data.status === "success") {
      return { isAuthenticated: true, user: response?.data?.data }
    } else if (response.status === "error") {
      return { isAuthenticated: false }
    }
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users/other-users-list")
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}
