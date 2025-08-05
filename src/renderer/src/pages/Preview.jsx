import { useEffect, useState } from "react"
import useAppStore from "../store"
import Button from "../components/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import html2canvas from "html2canvas"

function Preview() {

    const store = useAppStore()
    const [expanded, setExpanded] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [imageBase64, setImageBase64] = useState('')

    useEffect(() => {
        if (store.content) {
            const card = document.getElementById('card-content')
            card.innerHTML = store.content
        }
        const background = localStorage.getItem('background') || '#000'
        const fontSize = localStorage.getItem('fontSize')   || 16
        const color = localStorage.getItem('color') || '#fff'
        const letterSpacing = localStorage.getItem('letterSpacing') || 0
        store.setBackground(background)
        store.setFontSize(fontSize)
        store.setColor(color)
        store.setLetterSpacing(letterSpacing)

    }, [])

    useEffect(() => {
        if (!showModal) {
            setImageBase64(null)
        }
    }, [showModal])

    useEffect(() => {
        if (imageBase64) {
            setShowModal(true)
        }
    }, [imageBase64])

    const toBase64Image = async () => {
        const content = document.getElementById('card')
        const canvas = await html2canvas(content, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio || 2,
            allowTaint: true,
        })
        const dataUrl = canvas.toDataURL("image/png")
        setImageBase64(dataUrl)
    }

    const preview = async () => {
        await toBase64Image()
    }

    const save = async () => {
        await window.api.toImage(imageBase64)
    }

    const saveStyle = () => {
        localStorage.setItem('background', store.background)
        localStorage.setItem('fontSize', store.fontSize)
        localStorage.setItem('color', store.color)
        localStorage.setItem('letterSpacing', store.letterSpacing)
    }

    return (
        <>
            <div className="bg">
                <div style={{
                    background: store.background,
                }} id="card" className="card">
                    <div style={{
                        fontSize: store.fontSize,
                        color: store.color,
                        letterSpacing: `${store.letterSpacing}px`
                    }} id="card-content" className="card-content">
                    </div>
                </div>
                <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
                    <div className="toggle-btn" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ChevronRight /> : <ChevronLeft />}
                        {/* <MoveRight /> */}
                    </div>
                    <div className="sidebar-content">
                        <div className="tools-wrapper">
                            <div className="flex justify-between items-center">
                                Background Color：<input value={store.background} onChange={e => store.setBackground(e.target.value)} type="color" />
                            </div>
                            <div className="flex justify-between items-center">
                                Font Size：<input min={12} max={36} step={1} value={store.fontSize} onChange={e => store.setFontSize(parseInt(e.target.value))} type="range" />
                                {store.fontSize}
                            </div>
                            <div className="flex justify-between items-center">
                                Font Color：<input value={store.color} onChange={e => store.setColor(e.target.value)} type="color" />
                            </div>
                            <div className="flex justify-between items-center">
                                Spacing：<input min={0} max={10} step={1} value={store.letterSpacing} onChange={e => store.setLetterSpacing(parseInt(e.target.value))} type="range" />
                                {store.letterSpacing}
                            </div>
                            <Button onClick={() => store.setPage(0)}>back</Button>
                            <Button onClick={preview}>preview</Button>
                            <Button onClick={saveStyle}>Save TextStyle</Button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()} // 阻止点击关闭弹窗
                    >
                        <div id="preview" className="preview">
                            <img className="image" src={imageBase64} crossOrigin="anonymous" />
                        </div>
                        <div className="action">
                            <Button onClick={save}>save</Button>
                            <Button onClick={() => setShowModal(false)}>close</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Preview
