import { ContestantInfo } from "models/tournament";
import React from "react";
import server_info from 'config/server.json'
import 'components/dialogs/style.css';

interface Props {
    tournament_id: number
    onError: (error) => void
    onSuccess: () => void
    onCancel: () => void
}

interface State {
    show: boolean
}

export default class JoinDialog extends React.Component<Props, State> {
    private inputsRef = {
        license_id: undefined,
        ranking_no: undefined
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            show: true
        }
    }

    private onSubmit = async (event): Promise<void> => {
        event.preventDefault();

        const license = this.inputsRef.license_id.value;
        const ranking = this.inputsRef.ranking_no.value;

        const user = new ContestantInfo(this.props.tournament_id, license, ranking);
        await this.sendData(user)
    }

    private sendData = async (payload: ContestantInfo) => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/contestants`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!data.ok) {
                throw Error(await data.text())
            }

            this.close()
            this.props.onSuccess()
        } catch (err) {
            this.props.onError(err)
        }
    }

    private close = () => {
        this.setState({ ...this.state, show: false })
    }

    render = () => {
        if (this.state.show) {
            return (
                <div className="container">
                    <form id="register-form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label className="form-check-label">License ID</label>
                            <input
                                type="text"
                                name="license_id"
                                className="form-control"
                                ref={r => this.inputsRef.license_id = r}
                            />

                            <label className="form-check-label">Ranking No</label>
                            <input
                                type="number"
                                name="ranking_no"
                                min={1}
                                className="form-control"
                                ref={r => this.inputsRef.ranking_no = r}
                            />
                        </div>

                        <div className="flex">
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Join"
                                id="submit"
                            />

                            <input
                                type="button"
                                className="btn btn-secondary"
                                value="Cancel"
                                onClick={() => { this.close(); this.props.onCancel() }}
                            />
                        </div>
                    </form>
                </div>
            );
        } else {
            return null
        }
    }
}
