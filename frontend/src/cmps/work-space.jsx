import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { useState } from "react"
import { BoardList } from "./board/board-list"
import { loadBoards } from '../store/board.action'

export function WorkSpace() {


    const { boards } = useSelector((storeState) => storeState.boardModule)

    useEffect(() => {
        onLoadBoards()
    }, [])


    async function onLoadBoards(filterBy) {
        try {
            await loadBoards(filterBy)
        }
        catch (err) {
            showErrorMsg('Cannot load boards')
        }
    }

    console.log(boards);
    return <section className="work-space">
        im work space
        <BoardList />
    </section>
}