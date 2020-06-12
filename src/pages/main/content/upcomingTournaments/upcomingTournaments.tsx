import React from "react";
import MaterialTable from "material-table";
import TournamentService, { TournamentShortInfo } from 'services/tournament/tournament'

interface Props {
    onTournamentClick?: (id: number) => void
}

interface State {
    data: TournamentShortInfo[]
}

export default class UpcomingTournamentsTable extends React.Component<Props, State> {
    private HEADERS = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Name', field: 'name' },
        { title: 'Date', field: 'date' }
    ]
    private INTERVAL_TIME_SEC = 5

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }

        this.retrieveData()
    }

    componentDidMount = () => {
        $('.Component-paginationSelectRoot-4').remove()
    }

    componentDidUpdate = () => {
        $('.Component-paginationSelectRoot-4').remove()
    }

    private retrieveData = async () => {
        const { error, data } = await TournamentService.retrieveClosestTournaments()
        if (error) {
            console.error(error)
        } else if (this.state.data.toString() !== data.toString()) {
            this.setState({ data })
        }

        const ms = this.INTERVAL_TIME_SEC * 1000
        setTimeout(() => this.retrieveData(), ms)
    }

    render = () => {
        return <MaterialTable
            title="Upcoming Tournaments"
            columns={this.HEADERS}
            data={this.state.data}
            options={{ draggable: false, pageSize: 10 }}
            onRowClick={(event, data) => this.props.onTournamentClick(data.id)} />
    }
}