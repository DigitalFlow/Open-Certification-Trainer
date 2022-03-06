import { RouteComponentProps } from "react-router-dom";
import UserInfo from "../model/UserInfo.js";

export interface IBaseProps {
  user?: UserInfo;
  triggerUserReload?: () => void;
}

export default interface ExtendedIBaseProps extends IBaseProps, RouteComponentProps { }
