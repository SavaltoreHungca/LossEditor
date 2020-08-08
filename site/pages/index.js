import { $ } from 'utils'
import { render as renderContent } from './render';

const Home = () => {
    const render = () => {
        $('container').innerHTML = '';
        renderContent($('container'));
    }

    React.useEffect(() => {
        render();
    }, [])

    return (
        <div>
            <div style={{padding: '10px', textAlign: 'center'}}><button onClick={render}>加载</button></div>
            <div id="container" style={
                { width: '100%', height: '100%' }}
            ></div>
        </div>
    )
}

export default Home