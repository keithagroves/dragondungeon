import React, { useEffect, useState } from 'react';
import { Box } from '../components';
import { Space } from '../components/space';
import { Center } from '../components/center';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { navigate } from '@reach/router';

let firebaseApp: any;

try {
  firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCRClPzTZnRSg_fAap6ENnAkxUBQKJGk5w",
    authDomain: "leaguedragoncoin.firebaseapp.com",
    projectId: "leaguedragoncoin",
    storageBucket: "leaguedragoncoin.appspot.com",
    messagingSenderId: "320692217416",
    appId: "1:320692217416:web:04f00569ed1bf7b55e9a7d"
  });
} catch {
  window.location.reload();
}

const resume = () => {
  navigate('/play/random');
}

const profilepage = () => {
  navigate('/profile');
}

const Game = () => {
  const [ userIsLoggedIn, setUserIsLoggedIn ] = useState<boolean>(false);
  useEffect(
    () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUserIsLoggedIn(true);
        }
      });
    }, []
  )
  return (
    <>
      <br /><br /><br />
      <Center>
        <Space size='xl'/>
        <Box>
          <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 'bold' }}>DragonCoin</h1>
        </Box>
        <br /><br /><br />
        {userIsLoggedIn && 
          <>
            <button onClick={resume} className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button" style={{backgroundColor: '#c60c30'}} data-upgraded=",MaterialButton"><span className="firebaseui-idp-icon-wrapper"><img className="firebaseui-idp-icon" alt="" src="/icon.png" /></span><span style={{ color: '#ffffff', fontSize: '25px', fontWeight: 'bolder' }} className="firebaseui-idp-text firebaseui-idp-text-long">Join Game</span><span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bolder' }} className="firebaseui-idp-text firebaseui-idp-text-short">Join</span></button>
            <br />
            <button onClick={profilepage} className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button" style={{backgroundColor: '#c60c30'}} data-upgraded=",MaterialButton"><span className="firebaseui-idp-icon-wrapper"><img className="firebaseui-idp-icon" alt="" src="/icon.png" /></span><span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bolder' }} className="firebaseui-idp-text firebaseui-idp-text-long">My Account</span><span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bolder' }} className="firebaseui-idp-text firebaseui-idp-text-short">Account</span></button>
            <br />
            <hr style={{ borderTop: '3px solid #c60c30', borderBottom: 'none', width: '100%' }} />
          </>
        }
        <StyledFirebaseAuth uiConfig={{
          signInSuccessUrl: '/',
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            'anonymous',
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          ]
        }}  firebaseAuth={firebaseApp.auth()}/>
        <br />
      </Center>
    </>
  );
}

export default Game;