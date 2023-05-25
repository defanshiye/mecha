import * as React from 'react';
import Root from '../client/App';

const createApp = (context, url, store) => {
  const App = () => {
    return <Root />;
  };
  console.log(111);
  return <App />;
};

export { createApp };
