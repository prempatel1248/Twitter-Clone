import { UserContextProvider } from './context/UserContext';
import { PostContextProvider } from './context/PostContext';
import Myrouter from './Myrouter';

function App() {
  
  return (
    <div>
      <UserContextProvider>
        <PostContextProvider>
          <Myrouter />
        </PostContextProvider>
      </UserContextProvider>

    </div>
  )
}

export default App