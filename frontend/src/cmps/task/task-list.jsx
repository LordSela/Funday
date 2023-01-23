import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { removeTask, saveTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { Add } from "monday-ui-react-core/icons";
import { Icon, MenuButton, Menu, MenuTitle, MenuItem } from "monday-ui-react-core";

export function TaskList({ group, toggleModal }) {

    const [newTask, setNewTask] = useState(boardService.getEmptyTask())
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [selectedTasks, setSelectedTasks] = useState([])
    const [columes, setColumes] = useState(boardService.getDefualtBoardColumes())
    let { board } = useSelector((storeState) => storeState.boardModule)

    async function onSaveTask(event) {
        event.preventDefault()
        if (!newTask.title) return
        try {
            await saveTask(board, group.id, newTask)
            setNewTask(boardService.getEmptyTask())
            showSuccessMsg('Task added')
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }


    function handleInputChange({ target }) {
        let { value, name: field } = target
        console.log('target', target);
        setNewTask((prevTask) => {
            return { ...prevTask, [field]: value }
        })
    }

    async function onRemoveTask(taskId) {
        try {
            await removeTask(board, group.id, taskId)
            showSuccessMsg('Task removed')
        } catch (err) {
            showErrorMsg('Cannot remove task')
        }
    }

    async function onDuplicateSelectedTasks(isInGroup) {
        if (selectedTasks.length) {
            try {
                for (const selectedTask of selectedTasks) {
                    const { id, ...taskToSave } = selectedTask;
                    await saveTask(board, group.id, taskToSave)
                }
            }
            catch (err) {
                console.log('Could not duplicate tasks', err)
            }
        }
    }
    function updateSelectedTasks(task) {
        setSelectedTasks([...selectedTasks, task])
    }

    function onAddColume(columeName) {
        setColumes([...columes, columeName])
    }

    function onRemoveColume(colume) {
        let newColumes = structuredClone(columes)
        let columeIdx = newColumes.findIndex(c => c === colume)
        newColumes.splice(columeIdx, 1)
        setColumes(newColumes)
    }

    return (
        <div className="task-list">

            <div className="task-title-row flex">
                <div className="checkbox-column task-column"
                    onClick={() => { setIsAllSelected(!isAllSelected) }}>
                    <div className="colored-tag first-tag" style={{ background: group.style?.color }}></div>
                    <input className='task-checkbox'
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={ev => {
                            ev.stopPropagation()
                            setIsAllSelected(!isAllSelected)
                        }} />
                </div>

                <div className="task-title task-column">Item</div>
                {columes.includes('person') && <div className="task-persons task-column"><span>Person</span></div>}
                {columes.includes('status') && <div className="task-status task-column">Status</div>}
                {columes.includes('date') && <div className="task-date task-column">Date</div>}
                {columes.includes('timeline') && <div className="task-timeline task-column">Timeline</div>}
                {columes.includes('priority') && <div className="task-status task-column">Priority</div>}
                {columes.includes('files') && <div className="task-files task-column">Files</div>}
                {columes.includes('checkbox') && <div className="checkbox task-column">Checkbox</div>}
                <div className="add-colume task-column flex align-center justify-center">
                    <Icon icon={Add} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />
                    <MenuButton>
                        <ul className={"menu-modal board-list-modal"}>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('person') }}>
                                <p className="menu-modal-option-text" >Person</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('status') }}>
                                <p className="menu-modal-option-text" >Status</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('date') }}>
                                <p className="menu-modal-option-text" >Date</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('timeline') }}>
                                <p className="menu-modal-option-text" >Timeline</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('priority') }}>
                                <p className="menu-modal-option-text">priority</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('files') }}>
                                <p className="menu-modal-option-text" >files</p>
                            </div>
                            <div className="menu-modal-option flex" onClick={() => { onAddColume('checkbox') }}>
                                <p className="menu-modal-option-text" >checkbox</p>
                            </div>
                        </ul>

                    </MenuButton>
                    <MenuButton>
                        <Menu
                            id="menu"
                            size="medium"
                        >
                            <MenuTitle
                                caption="Remove item"
                                captionPosition="top"
                            />

                            {columes.map(colume => {
                                return <MenuItem
                                    icon={function noRefCheck() { }}
                                    iconType="SVG"
                                    onClick={() => { onRemoveColume(colume) }}
                                    title={`${colume}`}
                                />
                            })}

                        </Menu>
                    </MenuButton>
                </div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview
                    key={currTask.id}
                    task={currTask}
                    onRemoveTask={onRemoveTask}
                    setNewTask={setNewTask}
                    onTitleInputChange={handleInputChange}
                    group={group}
                    board={board}
                    toggleModal={toggleModal}
                    isAllSelected={isAllSelected}
                    updateSelectedTasks={updateSelectedTasks}
                    columes={columes}
                />
            })}

            <div className="add-task-wrap flex">
                <div className="checkbox-column task-column disabled">
                    <div className="colored-tag last-tag"
                        style={{ background: group.style?.color }} />
                    <input className='task-checkbox disabled' type="checkbox" disabled={true} />
                </div>

                <form className='task-input-row' onSubmit={onSaveTask}>
                    <input
                        className="add-task-input"
                        placeholder='+ Add item'
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => onSaveTask(ev)}
                    />
                </form>
            </div>

        </div>
    )
}
