import React from 'react';
import { Link } from '@reach/router';
import { version } from '../../package.json';

const About = () => {
  return (
    <div style={{
      textAlign: 'center'
    }}>
      <br />
      <Link to="/">Back</Link>
      <h1>About Game</h1>
      <b>Version {version}</b>
    </div>
  );
}

export default About;