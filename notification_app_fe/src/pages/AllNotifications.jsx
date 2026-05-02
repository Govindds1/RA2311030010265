import { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Chip, 
  CircularProgress, Button, Grid, Alert 
} from '@mui/material';
import { Log } from '../../../logging_middleware/logger';


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJncjkzMTNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTk4NywiaWF0IjoxNzc3NzA1MDg3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGQ4N2ZkZjEtMmQ2YS00Nzg2LWJiNjMtMmUzZTQ4NjI2MmM3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ292aW5kIHJhaiIsInN1YiI6IjcwZWYyNGYwLWVmZWMtNDU3ZC05ZTc0LWI2YjMzODVkMDY0NSJ9LCJlbWFpbCI6ImdyOTMxM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImdvdmluZCByYWoiLCJyb2xsTm8iOiJyYTIzMTEwMzAwMTAyNjUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3MGVmMjRmMC1lZmVjLTQ1N2QtOWU3NC1iNmIzMzg1ZDA2NDUiLCJjbGllbnRTZWNyZXQiOiJBS1hVZ21ieGp2ck1jYUR5In0.GvzQ9oaxP7mTdUYTKcPRuRjNNFMVufXjp1ZMmWFG1Eg";
const API_URL = "/evaluation-service/notifications";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10; // Show 12 per page for a nice grid

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setLoading(true);
      try {
        Log("frontend", "info", "api", `Fetching all notifications page ${page}`);
        
        // Use the new 'page' parameter
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
          headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const data = await response.json();
        
        if (data && data.notifications) {
          setNotifications(data.notifications);
          Log("frontend", "info", "component", `Page ${page} loaded`);
        }
      } catch (err) {
        setError(err.message);
        Log("frontend", "error", "api", "Failed to fetch all notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, [page]); 

  const getTypeColor = (type) => {
    switch(type) {
      case 'Placement': return 'success';
      case 'Result': return 'info';
      case 'Event': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        All Notifications
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Failed to load: {error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {notifications.map((notif) => (
              <Grid item xs={12} sm={6} md={4} key={notif.ID}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip label={notif.Type} color={getTypeColor(notif.Type)} size="small" />
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {notif.Message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notif.Timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 5, mb: 5 }}>
            <Button 
              variant="contained" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              Previous Page
            </Button>
            <Typography sx={{ alignSelf: 'center', fontWeight: 'bold' }}>
              Page {page}
            </Typography>
            <Button 
              variant="contained" 
              // Assuming if we get fewer items than the limit, we hit the end
              disabled={notifications.length < limit} 
              onClick={() => setPage(page + 1)}
            >
              Next Page
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
