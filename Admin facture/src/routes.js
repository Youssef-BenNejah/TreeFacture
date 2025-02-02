/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Login from "views/examples/auth/Login";
import Register from "views/examples/auth/Register";

import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Users from "views/examples/Users/Users.js"

const decodeToken = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    console.error('Invalid token format', error);
    return null;
  }
};


const token = localStorage.getItem('token');
const decodedToken = token ? decodeToken(token) : null;
const currentUserId = decodedToken?.AdminID;

const isAuthenticated = !!currentUserId; 

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-circle-08 text-blue",
    component: <Users />,
    layout: "/admin",
  },
  !isAuthenticated && {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
  !isAuthenticated && {
    path: "/register",
    component: <Register />,
    layout: "/auth",
  }
].filter(Boolean);

export default routes;
