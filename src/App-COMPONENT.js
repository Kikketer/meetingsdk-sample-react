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

    try {
      await client.init({
        zoomAppRoot: meetingSDKElement, language: 'en-US', patchJsMedia: true, customize: {
          video: {
            isResizable: true,
            defaultViewType: 'gallery',
            viewSizes: {
              default: {
                width: 1000,
                height: 600
              }
            },
            popper: {
              disableDraggable: false
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

  function resizeVideo () {
    client.updateVideoOptions({
      viewSizes: {
        default: {
          width: Math.floor(Math.random() * 1280) + 720,
          height: Math.floor(Math.random() * 309) + 411,
        }
      }
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

        <button onClick={resizeVideo}>Resize</button>
        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  )
}

export default App
