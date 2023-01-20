import { useState } from "react";
import { useSelector } from "react-redux";
import { showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup } from "../../store/board.action";
import { TaskList } from "../task/task-list"

export function GroupPreview({ group, toggleModal, onRemoveGroup }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
    let { board } = useSelector((storeState) => storeState.boardModule)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)

    async function onRenameGroup(event) {
        event.preventDefault()
        if (!groupToSend?.title.length) setGroupToSend(prevGroup => ({ ...prevGroup }))
        try {
            await saveGroup(board, group.id, groupToSend)
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    function handleInputChange(event) {
        setGroupToSend({ ...groupToSend, title: event.target.value })
    }


    function openOptionModal(i) {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    return (
        <section className="group-preview ">
            {(isBoardOptionsOpen && board) && <ul className={"menu-modal group-modal "}>
                <div className="menu-modal-option flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)}
                        onClick={() => { }} />
                    <p className="menu-modal-option-text">Duplicate</p>
                </div>
                <div className="menu-modal-option flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)}
                        onClick={() => { onRemoveGroup(group.id) }} />
                    <p className="menu-modal-option-text" >Delete</p>
                </div>
            </ul>}

            <div className="flex align-center">
                <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                    onClick={() => { openOptionModal() }} />
                <form onSubmit={onRenameGroup} >
                    <input
                        className="group-title"
                        style={{
                            color: group.style?.color || "#FFF000",
                            width: `${groupToSend.title.length * 1.125}ch`
                        }}
                        type="text"
                        value={groupToSend.title}
                        onChange={handleInputChange}
                        onBlur={ev => { onRenameGroup(ev, ev.target.value) }}
                    />
                </form>
                <span className='number-of-tasks'>{group.tasks.length} items</span>
            </div>
            <TaskList group={group} toggleModal={toggleModal} />
            <div className="add-task">
            </div>
        </section>
    )
}