import useAppStore from "./store"
import Edit from "./pages/Edit"
import Preview from "./pages/Preview"

function App() {

  const store = useAppStore()

  return (
    <>
    {store.index ? 
      <Preview /> : 
      <Edit />
  }
    </>
  )
}

export default App
