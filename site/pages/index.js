// import { useEffect } from 'react'
// import { Editor } from 'editor';
// import { MemLoss } from 'client';
import { $, innerHtml } from 'utils'
import { ScrollPage } from 'scroll-page'

const Home = () => {
    const render = () => {
        $('container').innerHTML = '';
        // new MemLoss($('container'));
        new ScrollPage($('container'), {
            containerHeight: 300,
            containerWidth: 300
        })
    }

    React.useEffect(() => {
        render();
    }, [])

    return (
        <div>
            <div> <button onClick={render}>加载</button></div>
            <div id="container" style={
                { width: '80vw', height: '80vh' }}
            />
        </div>
    )
}

export default Home