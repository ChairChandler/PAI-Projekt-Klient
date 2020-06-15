import React from 'react';
import { LadderInfo, ContestantDecision } from 'models/tournament'
import TournamentService from 'services/tournament/tournament'
import ContestantService from 'services/contestant/contestant'
import './style.css'
import './jquery.bracket.scss'

interface Props {
    tournament_finished: boolean
    tournament_id: number
    contestant_user_id?: number
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
            state.ladder = data
            this.setState(state)

            $('#ladder')['bracket']({
                init: this.parseData()
            })
        }
    }

    private parseData = () => {
        const levels = this.parseTeams()
        const teams = levels[0].map(t => t.opponents)
        const results = levels.map(l => l.map(t => t.results))

        const minimalData = {
            teams, results
        }
        console.log(minimalData)
        return minimalData
    }

    private parseTeams = (): { opponents: string | null[], results: number | null[] }[][] => {
        const contestants = this.state.ladder?.contestants
        const findEnemyInLine = (node: number) => {
            const winnerNode = Math.floor((node - 1) / 2)
            const enemy = contestants.find(
                ({ node_id }) => node_id === winnerNode
            )
            return winnerNode < 0 ? null : enemy?.name ?? findEnemyInLine(winnerNode)
        }

        const prevEndLevelNode = (node: number) => Math.pow(2,
            Math.floor(Math.log2(node + 1))
        ) - 2



        let startNode = Math.pow(2,
            Math.floor(Math.log2(this.state.ladder?.lastNode + 1)) + 1
        ) - 2

        const teams = []
        do {
            const levelTeams = []
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            let endNode = prevEndLevelNode(node ?? startNode)
            for (var node = startNode; node > endNode; node -= 2) {
                const [a, b] = contestants.filter(
                    // eslint-disable-next-line no-loop-func
                    ({ node_id }) => node_id === node || node_id === (node - 1)
                )

                if (a && b) {
                    levelTeams.push({ opponents: [a.name, b.name], results: [null, null] })
                } else {
                    levelTeams.push({ opponents: [a?.name ?? b?.name ?? null, findEnemyInLine(node)], results: [0, 1] })
                }
            }
            teams.push(levelTeams)
            startNode = node
        } while (node > 0)

        return teams
    }

    private sendDecision = async (decision: 'winner' | 'loser') => {
        const payload = new ContestantDecision(
            this.props.tournament_id,
            this.props.contestant_user_id,
            decision === 'winner'
        )
        const { error } = await ContestantService.setDecision(payload)
        if (error) {
            this.props.onError(error)
        }
    }

    render = () => {
        return <div className="container-context container-center-col">
            <div id="ladder" className="jQBracket" />

            {
                this.props.contestant_user_id && !this.props.tournament_finished &&
                <div className="container-center-row" style={{ marginTop: '200px' }}>
                    <input
                        type="button"
                        className="btn btn-primary"
                        value="WINNER"
                        onClick={() => this.sendDecision('winner')}
                    />

                    <input
                        type="button"
                        className="btn btn-primary"
                        value="LOSER"
                        onClick={() => this.sendDecision('loser')}
                    />
                </div>
            }
        </div>
    }
}