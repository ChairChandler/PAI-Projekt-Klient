import { ContestantInfo } from "models/tournament";
import React from "react";
import 'components/dialogs/style.css';
import JoinTournamentService from 'services/contestant/join-tournament'

interface Props {
    tournament_id: number
    onError?: (error) => void
    onSuccess?: () => void
    onCancel?: () => void
}

export default class JoinDialog extends React.Component<Props, {}> {
    private inputsRef = {
        license_id: undefined,
        ranking_no: undefined
    }

    private onSubmit = async (event): Promise<void> => {
        event.preventDefault();

        const license = this.inputsRef.license_id.value;
        const ranking = this.inputsRef.ranking_no.value;

        const user = new ContestantInfo(this.props.tournament_id, license, ranking);
        const { error } = await JoinTournamentService.join(user)
        if (error) {
            this.props.onError?.(error)
        } else {
            this.props.onSuccess?.()
        }
    }

    render = () => {
        return (
            <div className="container">
                <form className="dialog-form" onSubmit={this.onSubmit}>
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
                            onClick={this.props.onCancel}
                        />
                    </div>
                </form>
            </div>
        );
    }
}
