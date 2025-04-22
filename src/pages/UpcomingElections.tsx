import { useWebSocket } from '../hooks/useWebSocket';

const UpcomingElections = () => {
  const [elections, setElections] = useState([]);

  useWebSocket((message) => {
    if (message.type === "newEvent") {
      console.log("New event received:", message.data);
      setElections((prevElections) => {
        const updatedElections = [...prevElections, message.data];
        const sortedElections = sortElectionsByDateTime(updatedElections);
        localStorage.setItem("upcomingElections", JSON.stringify(sortedElections));
        return sortedElections;
      });
    }
  });

  // ... rest of your component code ...
};

