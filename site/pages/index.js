// import { useEffect } from 'react'
import { Editor } from 'editor';
// import { MemLoss } from 'client';
import { $, innerHtml } from 'utils'
import { ScrollPage } from 'scroll-page'

const Home = () => {
    const render = () => {
        // new MemLoss($('container'));
        // $('container').innerHTML = '';
        // new ScrollPage($('container'), {
        //     containerHeight: 300,
        //     containerWidth: 300
        // })
        new Editor($('editor-container'));
    }

    React.useEffect(() => {
        render();
    }, [])

    return (
        <div>
            <div> <button onClick={render}>加载</button></div>
            {/* <div id="container" style={
                { width: '1000px', height: '1000px' }}
            >
                <div id="hah" style={{
                    position: 'absolute',
                    left: '700px',
                    top: '800px'
                }}>你</div>
            </div> */}
            <div id="editor-container" style={
                { width: '400px', height: '400px' }}
            ></div>
        </div>
    )
}

export default Home