import React from "react";
import 'components/dialogs/style.css';

interface Props {
    onYesClick?: () => void
    onNoClick?: () => void
}

export default class QuestionDialog extends React.Component<Props, {}> {
    render = () => {
        return (
            <div className="container">
                <div className="dialog-form">
                    <div className="form-group">
                        <label className="form-check-label">Are you sure?</label>
                    </div>

                    <div className="flex">
                        <input
                            type="button"
                            className="btn btn-primary"
                            value="Yes"
                            onClick={this.props.onYesClick}
                        />

                        <input
                            type="button"
                            className="btn btn-secondary"
                            value="No"
                            onClick={this.props.onNoClick}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
