import React from 'react';
import { LadderInfo, ContestantDecision } from 'models/tournament'
import TournamentService from 'services/tournament/tournament'
import ContestantService from 'services/contestant/contestant'
import './style.css'
import './jquery.bracket.scss'

interface Props {
    tournament_id: number
    contestant_user_id?: number
    onError?: (err: string) => void
}

interface State {
    decision?: 'winner' | 'loser'
    tournament_finished?: boolean
}

export default class Ladder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
        this.getIsTournamentFinished().then(this.retrieveLadder)
    }

    private getIsTournamentFinished = async () => {
        const { error, data } = await TournamentService.retrieveTournamentInformation(this.props.tournament_id)
        if(error) {
            alert(error)
        } else {
            const state = { ...this.state }
            state.tournament_finished = data.finished
            this.setState(state)
        }
    }

    private retrieveLadder = async () => {
        const { error, data } = await TournamentService.retrieveLadder(this.props.tournament_id)
        if (error) {
            this.props.onError(error)
        } else {
            const { decision, minimalData } = this.parseData(data)

            const state = { ...this.state }
            state.decision = decision
            this.setState(state)

            $('#ladder')['bracket']({
                init: minimalData
            })
        }
    }

    private parseData = (ladder: LadderInfo) => {
        const levels = this.parseTeams(ladder)
        const teams = levels[0].map(t => t.opponents.map(o => o.name))
        const results = levels.map(l => l.map(t => t.results))

        let decision
        for (const l in levels.reverse()) {
            for (const t in levels[l]) {
                const { opponents, results } = levels[l][t]
                const myIndex = opponents.findIndex(
                    o => o?.id === this.props.contestant_user_id)

                if (myIndex > -1) {
                    const myResult = results[myIndex]
                    decision = myResult === 0 ? 'loser' : myResult === 1 ? 'winner' : null
                }
            }
        }

        const minimalData = {
            teams, results
        }
        return { decision, minimalData }
    }

    private parseTeams = (ladder: LadderInfo): { opponents: { name: string | null, id: number }[], results: (number | null)[] }[][] => {

        const contestants = ladder?.contestants
        const findEnemyInLine = (node: number) => {
            const winnerNode = Math.floor((node - 1) / 2)
            const enemy = contestants.find(
                ({ node_id }) => node_id === winnerNode
            )
            return winnerNode < 0 ? null : enemy ? { name: enemy.name, id: enemy.id } : findEnemyInLine(winnerNode)
        }

        const prevEndLevelNode = (node: number) => Math.pow(2,
            Math.floor(Math.log2(node + 1))
        ) - 2



        let startNode = Math.pow(2,
            Math.floor(Math.log2(ladder?.lastNode + 1)) + 1
        ) - 2

        const teams = []
        do {
            const levelTeams = []
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            let endNode = prevEndLevelNode(node ?? startNode);
            for (var node = startNode; node > endNode; node -= 2) {
                const [a, b] = contestants.filter(
                    // eslint-disable-next-line no-loop-func
                    ({ node_id }) => node_id === node || node_id === (node - 1)
                )

                if (a && b) {
                    const infoA = { name: a.name, id: a.id }
                    const infoB = { name: b.name, id: b.id }

                    let resA: any = a.defeated
                    if (resA !== null) {
                        resA = resA === true ? 0 : 1
                    }

                    let resB: any = b.defeated
                    if (resB !== null) {
                        resB = resB === true ? 0 : 1
                    }

                    const results = resA === resB ? [null, null] : [resA, resB]
                    levelTeams.push({ opponents: [infoA, infoB], results })
                } else {
                    const info = a ? { name: a.name, id: a.id } : b ? { name: b.name, id: b.id } : null
                    let resContestant: any = a ? a.defeated : b ? b.defeated : null
                    if (resContestant !== null) {
                        resContestant = resContestant === true ? 0 : 1
                    }
                    levelTeams.push({ opponents: [info, findEnemyInLine(node)], results: [resContestant, 1] })
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
        // eslint-disable-next-line no-restricted-globals
        location.reload()
    }

    render = () => {
        return <div className="container-context container-center-col">
            <h1 style={{ textAlign: "center" }}>{this.state.tournament_finished ? 'Tournament finished' : 'Tournament started'}</h1>
            <div id="ladder" className="jQBracket" />



            {
                this.props.contestant_user_id && !this.state.tournament_finished ?
                    <>
                        <div className="container-center-row" style={{ marginTop: '200px' }}>
                            <input
                                type="button"
                                className="btn btn-primary"
                                value="WINNER"
                                onClick={() => this.sendDecision('winner')}
                            />

                            <h1>Your last decision: {this.state.decision ?? 'No decision'}</h1>

                            <input
                                type="button"
                                className="btn btn-primary"
                                value="LOSER"
                                onClick={() => this.sendDecision('loser')}
                            />
                        </div>
                    </>
                    :
                    null
            }
        </div>
    }
}