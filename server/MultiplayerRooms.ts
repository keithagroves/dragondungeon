import { Countdown, GameState, CoinJar, Player, Wall } from '../common'
import CoreRoom from './CoreRoom'
import { v4 } from 'uuid'
import { Client } from 'colyseus'

let botNames = require('./botnames.json')

export class SurvivalRoom extends CoreRoom {
  constructor() {
    let state = new GameState()
    state.gamemode = 'LDS'
    super(state)
  }

  async onJoin(
    client: Client,
    options: { token: string },
    _2: any,
  ): Promise<void> {
    super.broadcast('music', '/music/morebetter.mp3')
    super.onJoin(client, options, _2)
  }

  tick(): void {
    super.tick()

    let dragonsStanding = []
    this.state.players.forEach(player => {
      if (player.isGhost == false) {
        dragonsStanding.push(player.onlineName)
      }
    })

    if (dragonsStanding.length == 1 && this.state.players.size > 1) {
      super.gameOver(`${dragonsStanding[0]} was the last dragon standing!`)
    }
  }
}

export class ArenaRoom extends CoreRoom {

  constructor() {
    let state = new GameState()
    state.countdown = new Countdown(3, 0)
    state.coinJars.set(v4(), new CoinJar(1500, 1500, 0))

    let botPlayerA = new Player('mud', 0, 0)
    botPlayerA.onlineName =
      botNames[Math.floor(Math.random() * botNames.length)]
    botPlayerA.isBot = true
    state.players.set(v4(), botPlayerA)

    let botPlayerB = new Player('poison', 0, 0)
    botPlayerB.onlineName =
      botNames[Math.floor(Math.random() * botNames.length)]
    botPlayerB.isBot = true

    state.players.set(v4(), botPlayerB)

    state.walls.set(
      v4(),
      new Wall(3000 / 2 + 350, 3000 / 2 + 350, 700, 50, true, 2, 'coingrab', 0),
    )

    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 + 350,
        3000 / 2 + 350,
        700,
        50,
        false,
        2,
        'coingrab',
        0,
      ),
    )
    //bottom left
    state.walls.set(
      v4(),
      new Wall(3000 / 2 - 350, 3000 / 2 + 350, 700, 50, true, 2, 'coingrab', 0),
    )
    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 - 350 - 700,
        3000 / 2 + 350,
        700,
        50,
        false,
        2,
        'coingrab',
        0,
      ),
    )
    //top left
    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 - 350,
        3000 / 2 - 350 - 700,
        700,
        50,
        true,
        2,
        'coingrab',
        0,
      ),
    )
    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 - 350 - 700,
        3000 / 2 - 350,
        700,
        50,
        false,
        2,
        'coingrab',
        0,
      ),
    )
    //top right
    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 + 350,
        3000 / 2 - 350 - 700,
        700,
        50,
        true,
        2,
        'coingrab',
        0,
      ),
    )
    state.walls.set(
      v4(),
      new Wall(
        3000 / 2 + 350,
        3000 / 2 - 350,
        700,
        50,
        false,
        2,
        'coingrab',
        0,
      ),
    )

    super(state)
  }

  async onJoin(
    client: Client,
    options: { token: string },
    _2: any,
  ): Promise<void> {
    super.broadcast('music', '/music/risingtide.mp3')
    super.onJoin(client, options, _2)
  }

  tick(): void {
    super.tick()
    for (
      let i = super.getState().coins.size;
      i < super.getState().players.size * 20;
      i++
    ) {
      super.spawnCoin()
    }
    
    this.moveBots()
  }
}

export class CaptureRoom extends CoreRoom {
  constructor() {
    let state = new GameState()
    state.gamemode = 'CTC'
    state.countdown.minutes = 3
    state.coinJars.set(v4(), new CoinJar(200, 1500, 1))
    state.coinJars.set(v4(), new CoinJar(2800, 1500, 2))
    let setWallTeam = (i: number, isRedTeam: boolean) => {
      if (i == 0 || i == 3) {
        return 0
      } else {
        if (isRedTeam) {
          return 1
        } else {
          return 2
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          i * (3000 / 3 / 4),
          3000 / 3,
          3000 / 3 / 4,
          30,
          false,
          10,
          'CTC',
          setWallTeam(i, true),
        ),
      )
    }

    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          3000 / 3,
          i * (3000 / 3 / 4) + 3000 / 3,
          3000 / 3 / 4,
          30,
          true,
          10,
          'CTC',
          setWallTeam(i, true),
        ),
      )
    }
    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          i * (3000 / 3 / 4),
          (3000 / 3) * 2,
          3000 / 3 / 4,
          30,
          false,
          10,
          'CTC',
          setWallTeam(i, true),
        ),
      )
    }
    //RIGHT SIDE
    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          i * (3000 / 3 / 4) + 3000 / 1.5,
          3000 / 3,
          3000 / 3 / 4,
          30,
          false,
          10,
          'CTC',
          setWallTeam(i, false),
        ),
      )
    }
    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          3000 / 3 + 3000 / 3,
          i * (3000 / 3 / 4) + 3000 / 3,
          3000 / 3 / 4,
          30,
          true,
          10,
          'CTC',
          setWallTeam(i, false),
        ),
      )
    }
    for (let i = 0; i < 4; i++) {
      state.walls.set(
        v4(),
        new Wall(
          i * (3000 / 3 / 4) + 3000 / 1.5,
          (3000 / 3) * 2,
          3000 / 3 / 4,
          30,
          false,
          10,
          'CTC',
          setWallTeam(i, false),
        ),
      )
    }

    super(state)
  }

  tick(): void {
    super.tick()
    if (super.getState().coins.size < 100) {
      super.spawnCoin()
    }
  }
}

export class EssentialRoom extends CoreRoom {
  constructor() {
    let state = new GameState()
    super(state)
  }
}
