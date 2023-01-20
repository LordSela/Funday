import { useEffect, useRef } from 'react'
import { useState } from "react"
import { boardService } from "../../services/board.service";
import { showErrorMsg } from "../../services/event-bus.service";
import { utilService } from '../../services/util.service';
import { addGroup, removeGroup, saveGroup, saveTask } from "../../store/board.action";
import { LabelSelect } from '../lable-select';
import { GroupPreview } from "./group-preview";


export function GroupList({ board, toggleModal, setFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    // setFilter = useRef(utilService.debounce(setFilter))
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)

    useEffect(() => {
        setFilter(filterByToEdit)
        // setFilter.current(filterByToEdit)
    }, [filterByToEdit])


    async function onAddItem(isGroup) {
        try {
            let itemToSave;
            if (isGroup) {
                itemToSave = boardService.getEmptyGroup()
                await addGroup(itemToSave, board)
            }
            else {
                itemToSave = boardService.getEmptyTask()
                itemToSave.title = `New Item`
                await saveTask(board, 0, itemToSave)
            }
        } catch (err) {
            showErrorMsg('Cannot save board')
        }
    }

    async function onUpdateGroup(board, groupId) {
        saveGroup()
    }

    async function onRemoveGroup(groupId) {
        console.log('here');
        removeGroup(board, groupId)
    }

    function handleFilterChange({ target }) {
        let { value, name: field } = target
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function handleLableChange(lables) {
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, lables: lables }))
    }



    const searchIcon = 'search-board.svg'

    return <ul className="group-list">
        <hr className="group-list-main-hr" />
        <div className="board-actions flex">
            <button className="new-group-btn" onClick={() => { onAddItem(false) }}>New Task</button>
            <button className="new-group-btn" onClick={() => { onAddItem(true) }}>New Group</button>
            <div className='gruop-serach-filter flex'>
                <img className="search-board-icon board-icon" src={require(`/src/assets/img/${searchIcon}`)} />
                <input type="text"
                    onChange={handleFilterChange}
                    value={filterByToEdit.title} placeholder='Search'
                    name='title' />
            </div>
            <LabelSelect handleLableChange={handleLableChange} lables={lables} />


        </div>

        {board.groups.map((group, i) =>
            <li className="group-preview-line" key={group.id}>
                <GroupPreview group={group} toggleModal={toggleModal} onRemoveGroup={onRemoveGroup} />
                <button onClick={() => onRemoveGroup(group.id)}>Delete</button>
            </li>)}
    </ul>
}