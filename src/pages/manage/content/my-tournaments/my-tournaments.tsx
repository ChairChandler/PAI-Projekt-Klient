import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { IconButton } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

export type TableHeaders = { id: number, name: string, date: Date, take_part: boolean, finished: boolean }

interface Props {
    data: TableHeaders[]
    onShow: (id: number) => void
    onEdit: (id: number) => void
    onCreate: () => void
}

export default class MyTournamentsTable extends React.Component<Props, {}> {
    private HEADERS = [
        { title: 'ID', field: 'id', hidden: true },
        { title: 'Name', field: 'name' },
        { title: 'Date', field: 'date' }
    ]

    render = () => {
        return <>
            <section>
                <MaterialTable
                    title="Created future tournaments"
                    columns={this.HEADERS}
                    data={this.props.data.filter(v => !v.take_part && !v.finished)}
                    options={{ draggable: false }}
                    onRowClick={(event, data) => this.props.onShow(data.id)}
                    actions={[
                        {
                            icon: () => <EditOutlinedIcon />,
                            tooltip: 'Edit Tournament Informations',
                            onClick: (event, data) => this.props.onEdit((data as TableHeaders).id)
                        }
                    ]}
                    components={{
                        Toolbar: props => (
                            <div>
                                <MTableToolbar {...props} />
                                <div style={{ padding: '0px 10px' }}>
                                    <IconButton onClick={this.props.onCreate}>
                                        <AddOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ),
                    }} />

            </section>

            <section>
                <MaterialTable
                    title="Created finished tournaments"
                    columns={this.HEADERS}
                    data={this.props.data.filter(v => !v.take_part && v.finished)}
                    options={{ draggable: false }}
                    onRowClick={(event, data) => this.props.onShow(data.id)} />
            </section>

            <section>
                <MaterialTable
                    title="Contestant future tournaments"
                    columns={this.HEADERS}
                    data={this.props.data.filter(v => v.take_part && !v.finished)}
                    options={{ draggable: false }}
                    onRowClick={(event, data) => this.props.onShow(data.id)} />
            </section>

            <section>
                <MaterialTable
                    title="Contestant finished tournaments"
                    columns={this.HEADERS}
                    data={this.props.data.filter(v => v.take_part && v.finished)}
                    options={{ draggable: false }}
                    onRowClick={(event, data) => this.props.onShow(data.id)} />
            </section>
        </>
    }
}