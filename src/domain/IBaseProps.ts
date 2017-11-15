import UserInfo from "../model/UserInfo";

export default interface IBaseProps {
  user?: UserInfo;
  history?: any;
  location?: Location;
  match?: any;
}
