import React, { Component } from 'react';
import {FetchCustomer, UpdateCustomer} from '../../Gateways';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import './index.css';

export default class CustomerPlanPage extends Component {
  state = {
    customer: null,
    newAction: ''
  }
  
  componentDidMount() {
    FetchCustomer(this.props.match.params.id)
      .then(customer => {
        this.setState({ customer, editingGoal: (!customer.plan.goal) });
      })
      .catch(err => {
          if(err.message === 'NotFoundError'){
            this.setState({ customer: { vulnerabilities: {}, plan: { actions: [] }, customerId: this.props.match.params.id } });
          }else{
            this.setState({redirect: '/login'})
          }
      });
  }

  changeActionState = (e) => {
    const customer = this.state.customer;
    for(let action of customer.plan.actions) {
      if(action.id === e.target.dataset.actionid){
        action.done = e.target.checked ? (new Date()).toISOString() : null;
      }
    }
    this.setState({ customer }, this.save)
  }

  save = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer)
  }

  render() {
    if (this.state.redirect) return <Redirect push to={this.state.redirect} />;

    if (!this.state.customer) {
      return (
        <div className="lbh-container PlanPage">
          <h1>Fetching customer record...</h1>
        </div>
      );
    }

    return (
      <div className="lbh-container CustomerPlanPage">
        <h2>Shared plan</h2>
        <h3>Goal</h3>
        <div className="goal">
          <p>{this.state.customer.plan.goal}</p>
        </div>

        <h2>Steps we can both take</h2>
          {this.state.customer.plan.actions.filter(a => !a.done).length > 0
            ? <table className="actions actionsTodo">
                <thead>
                  <tr>
                    <td className="doneColumn"></td>
                    <td></td>
                    <td className="dateColumn">Agreed</td>
                    <td className="addedByColumn">Created by</td>
                  </tr>
                </thead>
                <tbody>
                {this.state.customer.plan.actions.filter(a => !a.done).map(action => {
                  return <tr key={action.id}>
                    <td className="govuk-checkboxes__item"><input type="checkbox" className="govuk-checkboxes__input" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                    <td>{action.action}</td>
                    <td>{moment(action.date).format('D/M/YYYY')}</td>
                    <td>{action.addedBy}</td>
                  </tr>
                })}
                </tbody>
              </table>
            : null}
            {this.state.customer.plan.actions.filter(a => a.done).length > 0
              ? <table className="actions actionsComplete">
                  <thead>
                    <tr>
                      <td className="doneColumn"></td>
                      <td></td>
                      <td className="dateColumn">Completed</td>
                      <td className="addedByColumn">Created by</td>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.customer.plan.actions.filter(a => a.done).map(action => {
                    return <tr key={action.id}>
                      <td className="govuk-checkboxes__item"><input type="checkbox" className="govuk-checkboxes__input" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                      <td>{action.action}</td>
                      <td>{moment(action.done).format('D/M/YYYY')}</td>
                      <td>{action.addedBy}</td>
                    </tr>
                  })}
                  </tbody>
                </table>
              : null}
      </div>
    );
  }
}
