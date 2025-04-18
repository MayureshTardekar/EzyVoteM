useEffect(() => {
  const socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    // Implement reconnection logic here if needed
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "newEvent") {
        console.log("New event received:", message.data);
        setElections((prevElections) => {
          const updatedElections = [...prevElections, message.data];
          return updatedElections.sort((a, b) => {
            const aDateTime = new Date(`${a.startDate}T${a.startTime}`);
            const bDateTime = new Date(`${b.startDate}T${b.startTime}`);
            return aDateTime.getTime() - bDateTime.getTime();
          });
        });
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
}, []);
