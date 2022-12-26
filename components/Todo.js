import styles from "../styles/todo.module.css"
import { IoIosAddCircle } from 'react-icons/io'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { AiFillDelete } from 'react-icons/ai'
import { AiOutlineMenu } from 'react-icons/ai'
import TaskABI from "../backend/build/contracts/TaskContract.json"
import { TaskContractAddress } from "../config"
import { ethers } from "ethers"
import { useEffect, useState } from "react"


const Todo = () => {



  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState([]) // an array which store all tasks

  // check wallet
  const checkWallet = async () => {
    const { ethereum } = window
    if (ethereum) {
    }
    else {
      alert("Please Install Metamsk")
    }
  }

  // connecting wallet
  const connectWallet = async () => {
    checkWallet()
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);  //metamask gets connected
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsLoggedIn(true)
      setCurrentAccount(accounts[0])
      console.log(accounts[0])
    }
    catch (error) {
      console.log("Please Install Metamsk")
    }

  }


  // getAllTask
  const getAllTask = async () => {
    try {

      // when add a task button is clicked we want metamask to open up
      const provider = new ethers.providers.Web3Provider(window.ethereum);  //metamask gets connected
      // after that we want to sign it as proof
      const signer = provider.getSigner()
      // getting our contract 
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskABI.abi,
        signer
      )
      let allTasks = await TaskContract.getMyTasks()
      setTasks(allTasks)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAllTask()
  })

  // add a task
  const addTask = (e) => {
    e.preventDefault()
    // creating an object task to put the values 
    let task = {
      // setting taskText as input
      taskText: input,
      isDeleted: false
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);  //metamask gets connected
      const signer = provider.getSigner()
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskABI.abi,
        signer
      )
      TaskContract.addTask(task.taskText, task.isDeleted).then(res => {
        setTasks([...tasks, task]) // let prev all tasks be there and add new task
      })
    } catch (error) {
      console.log(error)
    }
  }


  // delete a task
  const deleteTask = async (key) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);  //metamask gets connected
      const signer = provider.getSigner()
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskABI.abi,
        signer)
      // deleting task
      await TaskContract.deleteTask(key, true)
      // now lets get all the tasks after fitering
      let allTasks = await TaskContract.getMyTasks()
      setTasks(allTasks)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      {/* if not logged in */}
      {!isLoggedIn && (
        <div>
          <button onClick={connectWallet} className={styles.initial_btn}>
            Click To Connect Wallet
          </button>
        </div>
      )}

      {isLoggedIn && (<div className={styles.app_wrapper}>
        <div className={styles.nav}>
          <AiOutlineMenu size={25} className={styles.nav_btn1} />
          <div >
            <IoIosNotificationsOutline size={30} className={styles.nav_btn3} />
          </div>
        </div>
        <h1 className={styles.header1}>Hey Anant, Take A Look</h1>
        <h4 className={styles.header2}>Type It Down</h4>

        <form className={styles.form}>
          {/* value is se t as input and onchange is will see the changed value of textarea */}
          <input type="text" placeholder="Enter Task here" value={input} onChange={e => setInput(e.target.value)} className={styles.task_input} />
          <IoIosAddCircle onClick={addTask} className={styles.button_add} size={35} />
        </form>

        <div>
          <ul>
            <h3 className={styles.task_display_heading}>Pending tasks</h3>

            {tasks.map(item => (
              // have to give form it a  --------- key
              <form className={styles.form} key={item.id}>
                {/* displaying the tasks */}
                <p className={styles.task_display}>{item.taskText}</p>
                <AiFillDelete onClick={() => deleteTask(item.id)} className={styles.button_delete} size={32} />
              </form>
            ))}
          </ul>
        </div>
      </div>

      )}
    </>
  )
}

export default Todo