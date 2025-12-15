// Utility to test API connections and help debug CORS issues
const testAPIConnection = async () => {
  const endpoints = [
    "http://localhost/RoutePro-backend(02)/public/admin/users.php",
    "http://localhost/RoutePro-backend(02)/public/api/admin/system-stats.php",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      console.log(`Status: ${response.status}`);
      console.log(`Headers:`, response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log(`Success for ${endpoint}:`, data);
      } else {
        console.log(
          `Error for ${endpoint}: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Failed to connect to ${endpoint}:`, error);
    }
  }
};

// Export for use in components
export default testAPIConnection;
