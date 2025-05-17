import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  useEffect(()=>{
    const fetchdata = async ()=>{
    const result = await fetch("http://localhost:8000/api/product/3017624010701?fields=product_name,nutriscore_data")
    const data = await result.json()
    console.log(data)
    }
    fetchdata()
  },[])
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.product?.product_name}</h2>
      <pre>{JSON.stringify(data.product?.nutriscore_data, null, 2)}</pre>
    </div>
  );
}

export default App;
