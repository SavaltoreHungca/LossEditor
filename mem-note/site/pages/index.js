
import { ScrollPage } from 'scroll-page';
import { useEffect } from 'react'

const Home = () => {
  useEffect(()=>{
    new ScrollPage(document.getElementById('container'));
  })

  return (<div id="container" />)
}

export default Home
