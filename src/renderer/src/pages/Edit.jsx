import { useEffect, useState } from 'react'
import Button from '../components/Button'
import useAppStore from '../store'

function Edit() {

    const store = useAppStore()

    const [marked, setMark] = useState(false)

    useEffect(() => {
        if (store.content) {
            const content = document.getElementById('content')
            content.innerHTML = store.content
            setMark(true)
        }
    }, [])

    const toHinagana = async () => {
        const content = document.getElementById('content')
        const text = content.innerText

        const result = await window.api.toHiragana(text)
        content.innerHTML = result
        setMark(true)
    }

    const toRomaji = async () => {
        const content = document.getElementById('content')
        const text = content.innerText

        const result = await window.api.toRomaji(text)
        content.innerHTML = result
    }

    const clear = () => {
        setMark(false)
        const content = document.getElementById('content')
        content.innerHTML = ''
    }

    const next = () => {
        if (marked) {
            const content = document.getElementById('content')
            store.setContent(content.innerHTML)
            store.setPage(1)
        }
    }

    return (
        <div className='container'>
            <div className="action">
                <Button onClick={toHinagana}>Add Furigana</Button>
                {/* <Button onClick={toRomaji}>标注罗马音</Button> */}
                <Button onClick={clear}>Clear</Button>
                <Button onClick={next} disabled={!marked}>Next</Button>
            </div>
            <div className='wrapper'>
                <div id='content' className="content" contentEditable />
            </div>
        </div>
    )
}

export default Edit
