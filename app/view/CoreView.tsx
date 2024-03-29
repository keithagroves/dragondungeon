import { Room } from 'colyseus.js'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { GameState } from '../../common'
import { ColyseusService } from '../../lib/colyseus'
import { StateManager } from '../state/StateManager'
import { GameView } from './GameView'
import { MapSchema } from '@colyseus/schema'
import { Player } from 'common'

import styles from '../../styles/menu.module.css'

function MenuOption(props) {
  let router = useRouter()
  return (
    <div
      className={styles.link}
      onClick={() => {
        router.push(props.href)
      }}
    >
      {props.name}
    </div>
  )
}

let stateManager = new StateManager(
  new ColyseusService(
    window.location.protocol == 'http:' ? 'ws' : 'wss',
    window.location.hostname + ':1337',
  ),
  'arena',
)

function renderTableData(players: MapSchema<Player>) {
  let leaderboardData = []
  players.forEach((player: Player, key: any) => {
    const score = player.score
    let name = player.onlineName
    const ballType = player.ballType
    leaderboardData.push(
      <span style={{ justifyContent: 'start' }}>
        <img
          src={`/img/abilities/${ballType}ball.png`}
          style={{ height: '30px', padding: '10px', verticalAlign: 'sub' }}
        />{' '}
        {name}
        <b>
          &nbsp;&nbsp;<big>{score}</big>
        </b>
        <br />
      </span>,
    )
  })
  return leaderboardData
}

export default function CoreView({
  controls,
}: {
  controls: number
}) {
  const [room, setRoom] = useState<Room<GameState> | null>(null)
  const [state, setState] = useState<GameState | null>(null)
  const [gameOver, setGameOver] = useState<boolean>(false)

  useMemo(() => {
    let ref

    stateManager.getGameRoom.then(() => {
      ref = stateManager.room.onStateChange((newState) => {
        setGameOver(newState.gameOver)
        setState(newState)
      })
    })

    return () => {
      ref.clear()
    }
  }, [])

  if (state == null) {
    return (
      <div style={{ textAlign: 'center' }}>
        <br />
        <br />
        <br />
        <img
          style={{
            textAlign: 'center',
            height: '150px',
            imageRendering: 'pixelated',
          }}
          src="/img/skins/basic.png"
        />
      </div>
    )
  }

  if (gameOver) {
    return (
      <div style={{ padding: '30px' }} className={styles.pageContent}>
        <h1>Game Over</h1>
        <p style={{ color: '#f9e300', fontSize: '25pt' }}>{state.gameOverMessage}</p>
        {renderTableData(state.players)}
        <br /><br />
        <MenuOption name="New Game" href="/" />
      </div>
    )
  }

  return (
    <GameView
      stateManager={stateManager}
      state={state}
      controls={controls}
    />
  )
}
