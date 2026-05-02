import { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Chip, MenuItem, 
  Select, FormControl, InputLabel, CircularProgress, 
  Button, Grid, Alert 
} from '@mui/material';
import { Log } from '../../../logging_middleware/logger';


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJncjkzMTNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTk4NywiaWF0IjoxNzc3NzA1MDg3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGQ4N2ZkZjEtMmQ2YS00Nzg2LWJiNjMtMmUzZTQ4NjI2MmM3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ292aW5kIHJhaiIsInN1YiI6IjcwZWYyNGYwLWVmZWMtNDU3ZC05ZTc0LWI2YjMzODVkMDY0NSJ9LCJlbWFpbCI6ImdyOTMxM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImdvdmluZCByYWoiLCJyb2xsTm8iOiJyYTIzMTEwMzAwMTAyNjUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3MGVmMjRmMC1lZmVjLTQ1N2QtOWU3NC1iNmIzMzg1ZDA2NDUiLCJjbGllbnRTZWNyZXQiOiJBS1hVZ21ieGp2ck1jYUR5In0.GvzQ9oaxP7mTdUYTKcPRuRjNNFMVufXjp1ZMmWFG1Eg";
const API_URL = "/evaluation-service/notifications";

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls state
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Read/Unread state (loaded from browser memory)
  const [readMessages, setReadMessages] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Build the URL with query parameters
        let url = `${API_URL}?limit=${limit}`;
        if (typeFilter !== 'All') {
          url += `&notification_type=${typeFilter}`;
        }

        Log("frontend", "info", "api", `Fetching ${limit} ${typeFilter} notifications`);
        
        const response = await fetch(url, {
          headers: { "Authorization": `Bearer ${ACCESS_TOKEN}` }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const data = await response.json();
        
        if (data && data.notifications) {
          // Re-apply our Stage 1 sorting logic just to ensure strict priority
          const weights = { "Placement": 3, "Result": 2, "Event": 1 };
          const sorted = data.notifications.sort((a, b) => {
            const weightDiff = weights[b.Type] - weights[a.Type];
            if (weightDiff !== 0) return weightDiff;
            return new Date(b.Timestamp) - new Date(a.Timestamp);
          });
          
          setNotifications(sorted);
          Log("frontend", "info", "component", "Inbox loaded successfully");
        }
      } catch (err) {
        setError(err.message);
        Log("frontend", "error", "api", "Inbox fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [limit, typeFilter]); // Re-run effect whenever limit or filter changes

  // Function to mark a notification as read
  const handleMarkAsRead = (id) => {
    const updatedRead = [...readMessages, id];
    setReadMessages(updatedRead);
    localStorage.setItem('readNotifications', JSON.stringify(updatedRead));
    Log("frontend", "info", "state", "Notification marked as read");
  };

  // Helper to determine chip color based on Type
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
        Priority Inbox
      </Typography>

      {/* Control Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Top 'N'</InputLabel>
          <Select
            value={limit}
            label="Top 'N'"
            onChange={(e) => setLimit(e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={typeFilter}
            label="Filter Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error State */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>Failed to load: {error}</Alert>}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Notifications Grid */
        <Grid container spacing={3}>
          {notifications.map((notif) => {
            const isRead = readMessages.includes(notif.ID);
            
            return (
              <Grid item xs={12} md={6} key={notif.ID}>
                <Card 
                  elevation={isRead ? 1 : 4} 
                  sx={{ 
                    bgcolor: isRead ? '#f5f5f5' : '#ffffff',
                    borderLeft: isRead ? 'none' : '4px solid #1976d2',
                    transition: '0.3s'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip 
                        label={notif.Type} 
                        color={getTypeColor(notif.Type)} 
                        size="small" 
                        variant={isRead ? "outlined" : "filled"}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {notif.Timestamp}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mt: 1, mb: 2, 
                        fontWeight: isRead ? 'normal' : 'bold',
                        color: isRead ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {notif.Message}
                    </Typography>

                    {!isRead && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleMarkAsRead(notif.ID)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}