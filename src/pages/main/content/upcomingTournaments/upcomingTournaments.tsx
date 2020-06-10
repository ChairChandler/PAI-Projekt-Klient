import React from "react";
import MaterialTable from "material-table";
import server_info from 'config/server.json'

type TableHeaders = { id: number, name: string, date: Date }

interface Props {
    onTournamentClick: (id: number) => void
}

interface State {
    data: TableHeaders[]
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
        const ms = this.INTERVAL_TIME_SEC * 1000
        setInterval(() => this.retrieveData(), ms)
    }

    componentDidMount = () => {
        $('.Component-paginationSelectRoot-4').remove()
    }

    componentDidUpdate = () => {
        $('.Component-paginationSelectRoot-4').remove()
    }

    private retrieveData = async () => {
        const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/general`)
        if (!data.ok) {
            console.warn('Failed to retrieve upcoming tournaments')
        }

        const rows: TableHeaders[] = await data.json()
        if (this.state.data.toString() !== rows.toString()) {
            this.setState({ data: rows })
        }
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