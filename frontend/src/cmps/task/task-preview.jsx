import { useEffect, useState } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveTask } from "../../store/board.action"
import { DatePicker } from 'antd'
import dayjs from "dayjs"
import { TaskTitle } from "./task-title"
import { TaskPerson } from "./task-person"
import { PersonDetails } from "./person-details"
import { utilService } from "../../services/util.service"

export function TaskPreview({ task, onRemoveTask, board, group, toggleModal, isAllSelected }) {

    const [taskToUpdate, setTaskToUpdate] = useState(task)
    const [isTaskSelected, setIsTaskSelected] = useState(false)
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        console.log('useEffectDate', taskToUpdate.date)
    }, [])
    async function onAddTaskStatus(label) {
        try {
            let taskToSave = task
            taskToSave.status = label
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskDate(date) {
        try {
            setTaskToUpdate({ ...taskToUpdate, date })
            await saveTask(board, group.id, { ...taskToUpdate, date })
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskPerson(person) {
        console.log('person added', person)
        try {
            setTaskToUpdate({ ...taskToUpdate, persons: [...taskToUpdate.persons, person] })
            await saveTask(board, group.id, { ...taskToUpdate, persons: [...taskToUpdate.persons, person] })
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onRemoveTaskPerson(person) {
        try {
            setTaskToUpdate({ ...taskToUpdate, persons: [...taskToUpdate.persons.filter(currPerson => currPerson.id !== person.id)] })
            await saveTask(
                board,
                group.id,
                { ...taskToUpdate, persons: [...taskToUpdate.persons.filter(currPerson => currPerson.id !== person.id)] })
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }
    function handleNameInputChange(event) {
        console.log('length', event.target.value.length)
        setTaskToUpdate({ ...taskToUpdate, title: event.target.value })
    }

    async function onRenameTask(event) {
        event.preventDefault()
        try {
            await saveTask(board, group.id, taskToUpdate)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    function openOptionModal() {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    async function onDuplicateTask(task) {
        try {
            let copyTask = structuredClone(task)
            copyTask.id = ''
            copyTask.title = 'Copy ' + copyTask.title
            await saveTask(board, group.id, copyTask)
        } catch (err) {
            showErrorMsg('Cannot duplicate toy')
        }

    }


    const openTaskIcon = 'open-item.svg'
    const bubble = 'bubble.svg'
    const plusBubble = 'plus-bubble.svg'
    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    return (
        <div
            className="task-preview flex"
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}>
            {(isBoardOptionsOpen && board) && <ul className={"menu-modal task-modal"} >
                <div className="menu-modal-option flex" onClick={() => { onDuplicateTask(task) }}>
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)}
                    />
                    <p className="menu-modal-option-text">Duplicate</p>
                </div>
                <div className="menu-modal-option flex" onClick={() => { onRemoveTask(task.id) }}>
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)}
                    />
                    <p className="menu-modal-option-text" >Delete</p>
                </div>
            </ul>}
            {/* {showOptions && <img className="task-option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={() => { openOptionModal() }} />} */}
            <img className="task-option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={() => { openOptionModal() }} />

            <div
                className="checkbox-column task-column"
                onClick={() => { setIsTaskSelected(!isTaskSelected) }}>
                <div className='colored-tag' style={{ background: group.style?.color || '#FFF000' }} />
                <input className='task-checkbox' type="checkbox" checked={isAllSelected || isTaskSelected} />
            </div>

            <div className="task-txt task-column flex" onClick={() => toggleModal(board, group, task)}>
                <form onSubmit={onRenameTask} >
                    <input
                        className="task-title-input"
                        type="text"
                        value={taskToUpdate.title}
                        onChange={handleNameInputChange}
                        onBlur={ev => { onRenameTask(ev) }}
                        onClick={ev => { ev.stopPropagation() }}
                    />
                </form>
                <div className="comments-bubble task-column">
                    <img className="task-icon" src={require(`/src/assets/img/${(task.comments.length) ? bubble : plusBubble}`)} alt="" />
                    <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>
                </div>
            </div>


            <div className="task-persons task-column task-persons task-column flex align-center justify-center"
                onClick={() => setIsPersonsOpen(!isPersonsOpen)}>
                {task.persons && !isPersonsOpen &&
                    task.persons.map(currPerson => {
                        return <TaskPerson key={currPerson.id} person={currPerson} />
                    })}
                {isPersonsOpen &&
                    <div className="user-preview open">
                        <PersonDetails onAddTaskPerson={onAddTaskPerson} onRemoveTaskPerson={onRemoveTaskPerson} persons={task.persons} />
                    </div>}
            </div>

            <div className="task-status task-column"
                onClick={() => { setIsLablesOpen(!isLablesOpen) }}
                style={{ background: `${(task.status.txt === 'Default') ? '#fff' : task.status.color}` }}>

                <span>{`${(task.status.txt === 'Default' || !task.status.txt) ? '' : task.status.txt}`}</span>

                {isLablesOpen && <ul className="status-picker" >
                    <div className="arrow-up"></div>
                    {lables.map(lable => (<li key={lable.id}
                        className='label'
                        style={{ background: lable.color }} onClick={() => { onAddTaskStatus(lable) }}>{lable.txt}</li>)
                    )}</ul>}
            </div>
            <div className="task-date task-column">
                {/* {(task.date - Date.now() > 0)  && 'x'} */}
                <DatePicker
                    defaultValue={task.date ? dayjs(task.date) : ''}
                    bordered={false}
                    onChange={onAddTaskDate}
                    placeholder=""
                    format={'MMM D'}
                    suffixIcon
                />
            </div>
        </div>
    )
}