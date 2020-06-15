import React from 'react';
import { LadderInfo, ContestantDecision } from 'models/tournament'
import TournamentService from 'services/tournament/tournament'
import ContestantService from 'services/contestant/contestant'
import './jquery.bracket.scss'

interface Props {
    tournament_id: number
    onError?: (err: string) => void
}

interface State {
    ladder?: LadderInfo
}

export default class Ladder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
        this.retrieveLadder()
    }

    private retrieveLadder = async () => {
        const { error, data } = await TournamentService.retrieveLadder(this.props.tournament_id)
        if (error) {
            this.props.onError(error)
        } else {
            const state = { ...this.state }
            //state.ladder = data
            state.ladder = new LadderInfo(3, [
                { id: 0, name: '1', node_id: 1 },
                { id: 1, name: '2', node_id: 2 },
                { id: 3, name: '3', node_id: 3 }
            ])
            this.setState(state)

            $('#ladder')['bracket']({
                init: this.parseData()
            })
        }
    }

    private parseData = () => {
        const teams = this.parseTeams()

        const minimalData = {
            teams,
            results: [
                [[1, 2], [0, null]],       /* first round */

            ]
        }
        return minimalData
    }

    private parseTeams = () => {
        const findEnemyInLine = node => {
            const winnerNode = Math.floor((node - 1) / 2)
            if (winnerNode < 0) {
                return null
            }

            const enemy = this.state.ladder.contestants.find(
                ({ node_id }) => node_id === winnerNode
            )

            return enemy?.name || findEnemyInLine(winnerNode)
        }

        const startNode = Math.pow(2, Math.floor(Math.log2(this.state.ladder?.nodes + 1)))

        const teams = []
        const contestants = this.state.ladder?.contestants
        for (let node = startNode; node >= 0; node -= 2) {
            const c = contestants.find(
                ({ node_id }) => node_id === node
            )

            if (c) {
                const winnerNode = Math.floor((node - 1) / 2)
                const enemyLoserNode = 2 * winnerNode + ((Math.floor(node / 2) !== winnerNode) ? 1 : 2)

                let enemy = this.state.ladder.contestants.find(
                    ({ node_id: contNode }) => contNode === enemyLoserNode || contNode === winnerNode
                )

                if(!enemy) {
                    enemy = findEnemyInLine(winnerNode)
                }

                teams.push(node % 2 ? [c.name, enemy.name] : [enemy.name, c.name])
            }
        }

        console.log(teams)
        return teams
    }

    private parseResults = () => {
        for (let nodes = this.state.ladder?.nodes; nodes >= 0; nodes--) {

        }

    }

    render = () => {
        return <div id="ladder" className="jQBracket" style={{}} />
    }
}