import { ElementType } from "react";

import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DefaultLayout from "@/layouts/DefaultLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ForgotFwd from "@/pages/ForgotFwd";
import LikedPosts from "@/components/shared/LikedPosts"; 
import UpdateProfile from "@/components/forms/UpdateProfile";
import PostDetails from "@/components/shared/PostDetails";

interface RouteType {
    path: string;
    component: ElementType;
    layout: ElementType | null;
}

interface PrivateRouteType extends RouteType {
}

export const publicRoutes: RouteType[] = [
    { path: '/sign-in', component: Login, layout: AuthLayout },
    { path: '/sign-up', component: Register, layout: AuthLayout },
    { path: '/forgot-password', component: ForgotFwd, layout: AuthLayout },
]

export const privateRoutes: PrivateRouteType[] = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/profile/:id/*', component: Profile, layout: DefaultLayout },
    { path: '/update-profile/:id', component: UpdateProfile, layout: DefaultLayout },
    { path: '/liked-posts/:id', component: LikedPosts, layout: DefaultLayout },
    { path: '/posts/:id', component: PostDetails, layout: DefaultLayout },
]


