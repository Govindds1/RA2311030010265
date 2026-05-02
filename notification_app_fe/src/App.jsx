import { useEffect } from "react";
import { Log } from "../../logging_middleware/logger";

// Make sure to paste your actual token here!
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJncjkzMTNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzUzNywiaWF0IjoxNzc3NzAyNjM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjg2NDZkNDEtYTJlMy00Njg5LWEwZjAtODBjMThjOGU1YTA3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ292aW5kIHJhaiIsInN1YiI6IjcwZWYyNGYwLWVmZWMtNDU3ZC05ZTc0LWI2YjMzODVkMDY0NSJ9LCJlbWFpbCI6ImdyOTMxM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImdvdmluZCByYWoiLCJyb2xsTm8iOiJyYTIzMTEwMzAwMTAyNjUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3MGVmMjRmMC1lZmVjLTQ1N2QtOWU3NC1iNmIzMzg1ZDA2NDUiLCJjbGllbnRTZWNyZXQiOiJBS1hVZ21ieGp2ck1jYUR5In0.1730YroC3PKDJx6VYoZB2J7IlItLVnissL_Ql88DdPs";
const API_URL = "http://20.207.122.201/evaluation-service/notifications";

function App() {
  useEffect(() => {
    // ... inside your useEffect
    const fetchAndSortNotifications = async () => {
      try {
       Log("frontend", "info", "component", "Sorted top 10");
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        // Check if the response was successful before parsing
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // SAFETY NET: Check if notifications exist
        if (!data || !data.notifications) {
          console.error("Invalid data format received:", data);
          return;
        }

        const weights = {
          Placement: 3,
          Result: 2,
          Event: 1,
        };

        const sortedNotifications = data.notifications.sort((a, b) => {
          const weightDiff = weights[b.Type] - weights[a.Type];
          if (weightDiff !== 0) {
            return weightDiff;
          }
          return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const top10 = sortedNotifications.slice(0, 10);

        console.log("Stage 1 - Top 10 Priority Notifications:", top10);
        Log("frontend", "info", "api", "Fetching data");
      } catch (error) {
        console.error("Error fetching notifications:", error);
        Log("frontend", "error", "api", `Failed to fetch: ${error.message}`);
      }
    };

    fetchAndSortNotifications();
  }, []);

  return (
    <div>
      <h1>Stage 1: Logic Test</h1>
      <p>
        dev: govindraj
      </p>
    </div>
  );
}

export default App;
