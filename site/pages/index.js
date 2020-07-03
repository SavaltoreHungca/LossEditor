import { useEffect } from 'react'
import { Editor } from 'editor';
import { MemLoss } from 'client';

const Home = () => {
    useEffect(() => {
        // new Editor(document.getElementById('container'));
        new MemLoss(document.getElementById('test'));
    })

    return (
        <div>
            <div id="container"/>
            <div id="test" style={{width: '80vw', height: '80vh'}}/>
        </div>
    )
}

export default Home
