import { RouteConfig } from "react-router-config";
import CertificationOverview from "./components/CertificationOverview";
import CertificationManagement from "./components/CertificationManagement";
import PortalManagement from "./components/PortalManagement";
import Assessment from "./components/Assessment";
import AssessmentHistory from "./components/AssessmentHistory";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import PostEditView from "./components/PostEditView";

const routes = new Array<RouteConfig>(
    {
        path: "/",
        exact: true,
        component: WelcomePage
    },
    {
        path: "/index",
        exact: true,
        component: WelcomePage
    },
    {
        path: "/login",
        exact: true,
        component: Login
    },
    {
        path: "/logout",
        exact: true,
        component: Logout
    },
    {
        path: "/profile/:userId?",
        exact: true,
        component: Profile
    },
    {
        path: "/signUp",
        exact: true,
        component: SignUp
    },
    {
        path: "/assessment/:courseName?",
        component: Assessment
    },
    {
        path: "/assessmentHistory/:courseName?",
        component: AssessmentHistory
    },
    {
        path: "/certificationManagement/:courseName?",
        component: CertificationManagement
    },
    {
        path: "/certificationOverview/:courseName?",
        component: CertificationOverview
    },
    {
        path: "/portalManagement",
        component: PortalManagement
    },
    {
        path: "/post/:postId",
        exact: true,
        component: PostEditView
    }
);

export default routes;
