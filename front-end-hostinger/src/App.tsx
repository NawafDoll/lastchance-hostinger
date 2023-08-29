import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Background from "./components/Background";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ForgetPass from "./pages/ForgetPass";
import EditPaa from "./pages/EditPaa";
import "./components/app.css";
import TicketsPage from "./pages/TicketsPage";
import SaleTicket from "./pages/SaleTicket";
import UserProvider from "./components/ContextUser";
import PageUser from "./pages/PageUser";
import PayPage from "./pages/PayPage";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PageAdmin from "./pages/PageAdmin";
import AddEvent from "./pages/AddEvent";
import PageNotFound from "./pages/PageNotFound";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        {/* <PayPalScriptProvider options={initialOptions}> */}
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route element={<Background />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgetpass" element={<ForgetPass />} />
              <Route path="/user/editpass/:id/:token" element={<EditPaa />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/ticketspage/:_id" element={<TicketsPage />} />
            <Route path="/saleticket/:_id" element={<SaleTicket />} />
            <Route path="/pageuser/:id" element={<PageUser />} />
            <Route path="/paypage/:_id" element={<PayPage />} />
            {/* admin Route*/}
            <Route path="/pageadmin" element={<PageAdmin />} />
            <Route path="/addevent" element={<AddEvent />} />
            {/* 404 page not found */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        {/* </PayPalScriptProvider> */}
      </UserProvider>
    </ChakraProvider>
  );
};
