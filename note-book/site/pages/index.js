import { init } from 'note';

const Home = () => {
    const render = () => {
        init();
    }

    React.useEffect(() => {
        render();
    }, [])

    return (
        <div id="container" ></div>
    )
}

export default Home