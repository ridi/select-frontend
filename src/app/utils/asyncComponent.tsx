import React from 'react';

export function asyncComponent(getComponent: () => Promise<{ default: React.ComponentType<any> }>) {
  return class AsyncComponent extends React.Component {
    static ComponentAsStatic: React.ComponentType<any>;

    state: {
      ComponentInState: React.ComponentType<any>;
    } = {
      ComponentInState: AsyncComponent.ComponentAsStatic,
    };

    constructor(props: any) {
      super(props);
      if (!this.state.ComponentInState) {
        getComponent().then(({ default: Component }) => {
          if (!Component) {
            return;
          }

          AsyncComponent.ComponentAsStatic = Component;
          this.setState({ ComponentInState: Component });
        });
      }
    }

    render() {
      const { ComponentInState } = this.state;
      return ComponentInState ? <ComponentInState {...this.props} /> : null;
    }
  };
}
