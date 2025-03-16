import { ElementType } from "react";

import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DefaultLayout from "@/layouts/DefaultLayout";
import AuthLayout from "@/layouts/AuthLayout";

interface RouteType {
    path: string;
    component: ElementType;
    layout: ElementType | null;
}

interface PrivateRouteType extends RouteType {
}

export const publicRoutes: RouteType[] = [
    { path: '/login', component: Login, layout: AuthLayout },
    { path: '/register', component: Register, layout: AuthLayout },
]

export const privateRoutes: PrivateRouteType[] = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/profile', component: Profile, layout: null },
]


