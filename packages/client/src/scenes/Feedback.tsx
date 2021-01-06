import React from 'react';
import { Link } from '@reach/router';

const Feedback = () => {
  return (
    <div style={{
      textAlign: 'center'
    }}>
      <br />
      <Link to="/">Back</Link>
      <h1>Feedback &amp; Security</h1>
      <h2 id="thanks">Thanks</h2>
      <p>No one's listed here yet! Go ahead, report some bugs!</p>
      <h2 id="appsec">Policy</h2>
      <p>We are interested in the following bugs:</p>
      <ul>
        <li>XSS attacks targeting other players</li>
        <li>Unauthorized access to server-side code</li>
        <li>Unauthorized access to developer logs</li>
      </ul>
      <p>We are <b>not</b> interested in the following bugs:</p>
      <ul>
        <li>Network manipulation</li>
        <li>Proxys</li>
      </ul>
      <h2 id="report">Reporting a bug</h2>
      <p>To report a bug, please email lukewoodcs@gmail.com.</p>
    </div>
  );
}

export default Feedback;