import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Hello SSR</h1>
      <button onClick={() => alert('hello')}>Click Me</button>
    </div>
  );
};

export default App;
