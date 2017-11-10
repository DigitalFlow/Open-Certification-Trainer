import CertificationOverview from "./components/CertificationOverview";
import CertificationManagement from "./components/CertificationManagement";
import CertificationEditor from "./components/CertificationEditor";
import Assessment from "./components/Assessment";
import WelcomePage from "./components/WelcomePage";
import { RouteConfig } from "react-router-config";

const routes = new Array<RouteConfig>(
	{ path: '/',
		exact: true,
		component: WelcomePage,
	},
  { path: '/index',
		exact: true,
		component: WelcomePage,
	},
	{ path: '/assessment/:courseName?',
		component: Assessment
	},
	{ path: '/certificationManagement',
		component: CertificationManagement
	},
	{ path: '/certificationEditor/:courseName?',
		component: CertificationEditor
	},
	{ path: '/certificationOverview/:courseName?',
		component: CertificationOverview
	}
);

export default routes
