// logging_middleware/logger.js

const API_URL = "http://20.207.122.201/evaluation-service/logs";
// Replace this string with the token you got in Step 2
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJncjkzMTNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzUzNywiaWF0IjoxNzc3NzAyNjM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMjg2NDZkNDEtYTJlMy00Njg5LWEwZjAtODBjMThjOGU1YTA3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZ292aW5kIHJhaiIsInN1YiI6IjcwZWYyNGYwLWVmZWMtNDU3ZC05ZTc0LWI2YjMzODVkMDY0NSJ9LCJlbWFpbCI6ImdyOTMxM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImdvdmluZCByYWoiLCJyb2xsTm8iOiJyYTIzMTEwMzAwMTAyNjUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3MGVmMjRmMC1lZmVjLTQ1N2QtOWU3NC1iNmIzMzg1ZDA2NDUiLCJjbGllbnRTZWNyZXQiOiJBS1hVZ21ieGp2ck1jYUR5In0.1730YroC3PKDJx6VYoZB2J7IlItLVnissL_Ql88DdPs";

export const Log = async (stack, level, package_name, message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: package_name,
        message: message
      })
    });

    const data = await response.json();
    console.log("Log sent:", data);
  } catch (error) {
    console.error("Failed to send log:", error);
  }
};