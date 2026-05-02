import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import PriorityInbox from './pages/PriorityInbox';
import AllNotifications from './pages/AllNotifications';
import { useEffect } from 'react';
import { Log } from '../../logging_middleware/logger';

function App() {
  useEffect(() => {
    // Keep a simple log to prove the middleware is still active
    Log("frontend", "info", "component", "App initialized and router mounted");
  }, []);

  return (
    <Router>
      return (
    <CssBaseline />
    <AppBar position="static" sx={{ background: '#2c3e50' }}></AppBar>
      {/* Material UI Navigation Bar */}
      <AppBar position="static" sx={{ background: '#2c3e50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Priority Inbox
          </Button>
          <Button color="inherit" component={Link} to="/all">
            All Notifications
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<PriorityInbox />} />
            <Route path="/all" element={<AllNotifications />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;