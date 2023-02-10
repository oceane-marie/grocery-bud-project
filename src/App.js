import List from "./components/List";
import Alert from "./components/Alert";
import { useState, useEffect } from "react";

const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({show: false, msg: '', type: ''})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      showAlert(true, 'danger', 'please Enter Value')
    } else if (name && isEditing) {
        setList(
          list.map((item) => {
            if (item.id === editId) {
              return {...item, title: name}
            }
            return item
          })
        )
        setName('')
        setEditId(null)
        setIsEditing(false)
        showAlert(true, 'sucess', 'value changed')
    } else {
      showAlert(true, 'success', 'item Added to the List')
      const newItem = {id: new Date().getTime().toString(), title: name}
      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show = false, type = '', msg = '') =>{
    setAlert({ show, type, msg})
  }

  const clearList = () => {
    showAlert(true, 'danger', 'Empty List')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item Removed')
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditId(id)
    setName(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  })

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} remvoveAlert={showAlert} list={list} />}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
              type="text"
              className="grocery"
              placeholder="e.g eggs"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
          <button
              type="submit"
              className="submit-btn"
          >
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
