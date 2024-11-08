import './App.css';
import Login from './components/login/Login';

function App() {
  return (
    <>
      <div className='h-screen flex flex-col justify-center items-center'>
        <div>
          <p className='text-8xl text-center heading mb-0'>Lead Enrichment App</p>
        </div>
        <Login />
      </div>
    </>
  );
}

export default App;
