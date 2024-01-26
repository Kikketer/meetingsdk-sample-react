import {config} from 'dotenv'
import React from 'react';
config()

import './App.css';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

function App() {

  const client = ZoomMtgEmbedded.createClient();

  const urlParams = new URLSearchParams(window.location.search);
  const eml = urlParams.get('userEmail');
  const meetingNumber = urlParams.get('meetingNumber');
  const passWord = urlParams.get('password') || '';
  const zakToken = urlParams.get('zak') || '';

  var authEndpoint = 'http://localhost:4000'
  var sdkKey = process.env.SDK_KEY
  var role = 0
  var userName = 'React'
  var userEmail = `${eml || 'random'}@someplacerandom.page`
  var registrantToken = ''

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {

    let meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({zoomAppRoot: meetingSDKElement, language: 'en-US', patchJsMedia: true}).then(() => {
      client.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: meetingNumber,
        password: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken
      }).then(() => {
        console.log('joined successfully')
      }).catch((error) => {
        console.error('failed to join', error)
      })
    }).catch((error) => {
      console.error('failed to init', error)
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Lets do this!</h1>

        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
