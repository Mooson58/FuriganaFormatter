import { useEffect, useState, useRef } from 'react'
import Button from '../components/Button'
import useAppStore from '../store'

function Edit() {

    const store = useAppStore()

    const [marked, setMark] = useState(false)
    const [canCenter, setCanCenter] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (store.content) {
            const content = document.getElementById('content')
            content.innerHTML = store.content
            setMark(true)
        }
    }, [])

    useEffect(() => {
        if (marked) {
            const content = document.getElementById('content')
            content.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    e.preventDefault();

                    const selection = window.getSelection();
                    if (!selection || selection.rangeCount === 0) return;

                    const range = selection.getRangeAt(0);

                    const span = document.createElement('span');
                    span.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;'; // 插入 4 个不间断空格
                    range.insertNode(span);

                    // 将光标移到 span 之后
                    range.setStartAfter(span);
                    range.setEndAfter(span);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            })

            const checkSelection = () => {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) {
                    setCanCenter(false);
                    return;
                }

                const range = selection.getRangeAt(0);
                const contents = range.cloneContents();

                // 判断是否包含文字或图片
                const hasText = selection.toString().trim().length > 0;
                const hasImage = contents.querySelector && contents.querySelector('img');

                setCanCenter(hasText || !!hasImage);
            }

            document.addEventListener('mouseup', checkSelection);
            document.addEventListener('keyup', checkSelection);

            return () => {
                document.removeEventListener('mouseup', checkSelection);
                document.removeEventListener('keyup', checkSelection);
            }
        }
    }, [marked])

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

    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = function (event) {
            insertImageAtCursor(event.target.result)
        }
        reader.readAsDataURL(file)

        // 清空 input 的值，以便重复选择同一张图也能触发 change
        e.target.value = ''
    }

    const insertImageAtCursor = (src) => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return

        const range = selection.getRangeAt(0)
        const img = document.createElement('img')
        img.src = src
        img.alt = '用户上传图片'
        img.style.maxWidth = '100%'
        img.style.display = 'block'
        img.style.margin = '0 auto'

        range.insertNode(img)

        // 将光标移到图片后
        range.setStartAfter(img)
        range.setEndAfter(img)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const centerAlign = () => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        // 创建一个包裹元素
        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.appendChild(range.extractContents()); // 把原内容放进 div 中
        range.insertNode(wrapper);

        // 清除选区
        selection.removeAllRanges();
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
                <Button onClick={toHinagana} disabled={marked}>Add Furigana</Button>
                {/* <Button onClick={toRomaji}>标注罗马音</Button> */}
                <Button onClick={triggerUpload} disabled={!marked}>Insert Image</Button>
                <Button onClick={centerAlign} disabled={!canCenter}>Center Align</Button>
                <Button onClick={clear}>Clear</Button>
                <Button onClick={next} disabled={!marked}>Next</Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
            </div>
            <div className='wrapper'>
                <div id='content' className="content" contentEditable />
            </div>
        </div>
    )
}

export default Edit
