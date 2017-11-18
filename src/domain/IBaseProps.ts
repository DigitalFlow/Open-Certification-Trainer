import UserInfo from "../model/UserInfo";

export default interface IBaseProps {
  user?: UserInfo;
  triggerUserReload?: () => void;
  history?: any;
  location?: Location;
  match?: any;
}
