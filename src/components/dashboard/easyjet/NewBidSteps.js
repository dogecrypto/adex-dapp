import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import { Button } from 'react-toolbox/lib/button'
import MaterialStepper from 'components/dashboard/forms/stepper/MaterialStepper'
import BidForm from './BidForm'
import BidFormPreview from './BidFormPreview'
import NewBidHoc from './NewBidHoc'
import ValidItemHoc from 'components/dashboard/forms/ValidItemHoc'

const saveBtn = ({ ...props }) => {
    return (
        <Button icon='save' label='Place the bid' primary onClick={props.save} />
    )
}

const SaveBtnWithItem = NewBidHoc(saveBtn)

class NewBidSteps extends Component {

    render() {
        let pages = [{
            title: 'Step 1',
            component: ValidItemHoc(BidForm),
            props: { ...this.props, validateId: this.props.bidId }
        }, {
            title: 'Preview and bid',
            completeBtn: () => <SaveBtnWithItem {...this.props} itemType={this.props.itemType} addTo={this.props.addTo} onSave={this.props.onSave} />,
            component: ValidItemHoc(BidFormPreview),
            props: { ...this.props, validateId: this.props.bidId }
        }]

        return (
            <div style={{ textAlign: 'center' }}>
                <MaterialStepper pages={pages} />
            </div>
        )
    }
}

NewBidSteps.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    title: PropTypes.string,
    itemPages: PropTypes.arrayOf(PropTypes.func)
}

function mapStateToProps(state, props) {
    let persist = state.persist
    // let memory = state.memory
    return {
        account: persist.account,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewBidSteps)