import { useEffect } from 'react'
import './App.css'
// Import the middleware from outside the frontend folder
import { Log } from '../../logging_middleware/logger'

function App() {
  useEffect(() => {
    // Test the logger when the component mounts
    // Remember: only use the strict lowercase values allowed in the constraints!
    Log("frontend", "info", "component", "App component mounted successfully");
  }, []);

  return (
    <>
      <h1>Notification App</h1>
      <p>This is a simple notification app.</p>
    </>
  )
}

export default App