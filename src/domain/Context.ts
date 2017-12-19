export class Context {
  props: any;

  constructor() {
    this.props = { };
  }

  setProperty = (name: string, value: any) => {
    this.props[name] = value;
  }

  getProperty = <T>(name: string) => {
    return this.props[name] as T;
  }
}

const context = new Context();
export default context;
