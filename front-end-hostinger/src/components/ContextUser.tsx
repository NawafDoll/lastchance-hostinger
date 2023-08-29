import React, { useState, useEffect, useContext, createContext } from "react";
import jwt, { JwtPayload } from "jwt-decode";
import { useCookies } from "react-cookie";
import axios from "axios";
axios.defaults.withCredentials = true;
interface UserInfo {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}
const CreateUser = createContext<any>({ userInfo: {} });

const UserProvider = ({ children }: any) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    id: "",
    username: "",
    email: "",
    isAdmin: false,
  });

  const tt: any = localStorage.getItem("token");
  useEffect(() => {
    try {
      const decodeToken: any = jwt<JwtPayload>(tt);
      const { id, username, email, isAdmin } = decodeToken as UserInfo;
      setUserInfo({ id, username, email, isAdmin });

      //   console.log(userInfo);
    } catch (err) {
      console.log(err);
    }
  }, [tt]);

  return (
    <CreateUser.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </CreateUser.Provider>
  );
};

export const UserContext = () => {
  return useContext(CreateUser);
};

export default UserProvider;

// let firstRender = true;
// const refreshToken = async () => {
//   const res: any = await axios
//     .get("http://localhost:3336/user/refresh", {
//       withCredentials: true,
//     })
//     .catch((err) => console.log(err));
//   const data = await res.data;
//   console.log(data);
//   return data;
// };

// const sendRequist = async () => {
//   const res: any = await axios
//     .get("http://localhost:3336/user", {
//       withCredentials: true,
//     })
//     .catch((err) => console.log(err));
//   const data = await res.data;
//   return data;
// };
// useEffect(() => {
//   // console.log(userInfo);
//   if (firstRender) {
//     firstRender = false;
//     sendRequist()
//       .then((data) => setUserInfo(data.User))
//       .catch((err) => console.log(err));
//   }
//   let interval = setInterval(() => {
//     refreshToken()
//       .then((data) => setUserInfo(data.User))
//       .catch((err) => console.log(err));
//   }, 1000 * 28);
//   return () => clearInterval(interval);
// }, [userInfo]);

// console.log(token);
