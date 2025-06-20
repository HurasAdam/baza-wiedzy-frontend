import ReactQueryProvider from "./providers/react-query-provider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <ReactQueryProvider>
      <AppRoutes />
    </ReactQueryProvider>
  );
}

export default App;
