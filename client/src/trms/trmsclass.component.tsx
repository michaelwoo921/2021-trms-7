import React from 'react';
import { Trms } from './trms';

import trmsService from './trms.service';

interface TProps {
  which: number;
}
interface TState {
  data: Trms[];
}
class TrmsClassComponent extends React.Component<TProps, TState> {
  constructor(props: any) {
    super(props);
    console.log('Mounting: Constructor!');
    this.state = { data: [] };
  }

  componentDidMount() {
    console.log('Mounted Component');
    trmsService.getTrmss().then((data) => {
      console.log(data[0]);
      this.setState({ data: data });
    });
  }

  componentWillUnmount() {
    console.log('Component is removed from dom.');
  }

  shouldComponentUpdate() {
    console.log('If this returns false, it will not update');
    return true;
  }

  componentDidUpdate() {
    console.log('updated Component');
  }

  render() {
    console.log('render');
    return (
      <div>
        <h1>My Trms</h1>
        <p>
          {this.state.data.length ? this.state.data[this.props.which].name : ''}
        </p>
      </div>
    );
  }
}

export default TrmsClassComponent;
