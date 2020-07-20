import { useEffect } from 'react'
import { Editor } from 'editor';
import { MemLoss } from 'client';
import { $ } from 'utils'

const Home = () => {
    const render = () => {
        $('container').innerHTML = '';
        new MemLoss($('container'));
    }

    React.useEffect(() => {
        render();
    }, [])

    return (
        <div>
            <div><button onClick={render}>加载</button></div>
            <div id="container" style={{ width: '80vw', height: '80vh' }} />
        </div>
    )
}

export default Home
