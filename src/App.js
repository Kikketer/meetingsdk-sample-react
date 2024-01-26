import React from 'react'

import './App.css'
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded'

function App () {

  const client = ZoomMtgEmbedded.createClient()

  const urlParams = new URLSearchParams(window.location.search)
  const eml = urlParams.get('userEmail')
  const meetingNumber = urlParams.get('meetingNumber')
  const passWord = urlParams.get('password') || ''
  const zakToken = urlParams.get('zak') || ''
  const sdkKey = urlParams.get('sdkKey') || ''

  var authEndpoint = 'http://localhost:4000'
  var role = 0
  var userName = 'React'
  var userEmail = `${eml || 'random'}@someplacerandom.com`

  function getSignature (e) {
    e.preventDefault()

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

  async function startMeeting (signature) {

    let meetingSDKElement = document.getElementById('meetingSDKElement')
    let meetingSDKChatElement = document.getElementById('meetingSDKChatElement')

    try {
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        patchJsMedia: true,
        customize: {
          video: {
            popper: {
              disableDraggable: true
            }
          },
          chat: {
            popper: {
              disableDraggable: true,
              anchorElement: meetingSDKChatElement,
              placement: 'top'
            }
          }
        }
      })

      await client.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: meetingNumber,
        password: passWord,
        userName: userName,
        userEmail: userEmail,
        // tk: registrantToken,
        zak: zakToken,
        error: (e) => {
          console.error('Internal error ', e)
        }
      })

      console.log('meeting started')
    } catch (err) {
      console.error('failed to init', err)
    }
  }

  return (
    <div className="App">
      <main>
        <h1>Lets do this!</h1>

        <div className="row">
          <div className="column">
            <h3>Videos Here</h3>
            <div id="meetingSDKElement"></div>
          </div>
          <div className="column">
            <h3>My Content Here</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.</p>
            <button onClick={getSignature}>Join Meeting</button>
          </div>
          <div className="column">
            <h3>Chat Here</h3>
            <div id="meetingSDKChatElement"></div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default App
