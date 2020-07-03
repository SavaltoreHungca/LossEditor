import { useEffect } from 'react'
import { Editor } from 'editor';

const Home = () => {
    useEffect(() => {
        new Editor(document.getElementById('container'));
    })

    return (
        <div>
            <div id="container"/>
            <div id="test"/>
        </div>
    )
}

export default Home
