
import { Editor } from 'editor';
import { useEffect } from 'react'
import { Utils } from 'utils'

const Home = () => {
    useEffect(() => {
        new Editor(document.getElementById('container'));
    })

    return (
        <div id="container"/>
    )
}

export default Home
