import React, { Component } from 'react';
import {FetchCustomer, UpdateCustomer} from '../../Gateways';
import vulnerabilities from '../../vulnerabilities';
import defaultAction from '../../DefaultAction';
import moment from 'moment';
import './index.css';

function SuggestedAction(props) {
  const vuln = props.vulns.filter(v => v.category === props.vuln)[0];
  if(vuln.actions.length === 0) return null;
  return <div>
    <h3>{vuln.category}</h3>
    <ul>
      {vuln.actions.map(action => <li key={action}>
        {action}
      </li>)}
    </ul>
  </div>
}

function CopyPasteBox(props) {
  let text = [`Goal: ${props.customer.plan.goal}`, '']
  if(props.customer.plan.actions.filter(a => !a.done).length > 0){
    text.push("Actions to do:")
    text = text.concat(props.customer.plan.actions.filter(a => !a.done).map(a => {
      return `[ ] - ${a.action} - agreed on ${moment(a.date).format('D/M/YYYY')}`
    }))
    text.push("")
  }
  if(props.customer.plan.actions.filter(a => a.done).length > 0){
    text.push("Completed actions:")
    text = text.concat(props.customer.plan.actions.filter(a => a.done).map(a => {
      return `[x] - ${a.action} - done on ${moment(a.done).format('D/M/YYYY')}`
    }))
  }
  return (
    <div className="copyPaste">
      <p>You can copy the text below to paste into an email or text</p>
      <textarea value={text.join("\n")}></textarea>
    </div>
  )
}


export default class PlanPage extends Component {
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
          }
      });
  }

  save = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer)
      .then(success => {
        if(success){
          this.setState({ redirect: `/customers/${this.props.match.params.id}/plan` });
        }
      })
  }

  updateGoal = (e) => {
    const newValue = e.target.value
    this.setState(state => {
      state.customer.plan.goal = newValue;
      state.editingGoal = true;
      return state;
    })
  }

  saveGoal = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer)
      .then(success => {
        if(success){
          this.setState({ saved: true, editingGoal: false });
        }
      })
  }

  editGoal = () => {
    this.setState({ editingGoal: true });
  }

  updateNewAction = (e) => {
    this.setState({newAction: e.target.value});
  }

  addNewAction = () => {
    if(this.state.newAction !== ''){
      const newAction = {
        id: Math.random().toString(36).substring(2, 10),
        action: this.state.newAction,
        date: (new Date()).toISOString(),
        done: null
      }
      const customer = this.state.customer;
      customer.plan.actions.push(newAction);
      this.setState({ customer, newAction: ''}, this.save);
    }
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

  render() {
    if (!this.state.customer) {
      return (
        <div className="lbh-container PlanPage">
          <h1>Fetching customer record...</h1>
        </div>
      );
    }

    return (
      <div className="lbh-container PlanPage">
        <div className="leftColumn">
          <a className="backLink" href="https://beta.singleview.hackney.gov.uk">&lt;&lt; Back to Single View</a>
          <h2>Create a shared plan</h2>
          <h3>Goal</h3>
          {this.state.customer.plan.goal && !this.state.editingGoal
            ? <div className="goal">
                <p>{this.state.customer.plan.goal}</p>
                <button onClick={this.editGoal}>Edit</button>
              </div>
            : <div className="goal">
                <input type="text" onChange={this.updateGoal} value={this.state.customer.plan.goal}></input>
                <button onClick={this.saveGoal}>Save</button>
              </div>}

        <h2>Steps we can both take</h2>
          <div className="newAction">
            <input type="text" onChange={this.updateNewAction} value={this.state.newAction}></input>
            <button onClick={this.addNewAction}>Save</button>
          </div>
          {this.state.customer.plan.actions.filter(a => !a.done).length > 0
            ? <table className="actions actionsTodo">
                <thead>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Agreed on</td>
                  </tr>
                </thead>
                <tbody>
                {this.state.customer.plan.actions.filter(a => !a.done).map(action => {
                  return <tr key={action.id}>
                    <td className="doneColumn"><input type="checkbox" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                    <td>{action.action}</td>
                    <td className="dateColumn">{moment(action.date).format('D/M/YYYY')}</td>
                  </tr>
                })}
                </tbody>
              </table>
            : null}
            {this.state.customer.plan.actions.filter(a => a.done).length > 0
              ? <table className="actions actionsComplete">
                  <thead>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>Completed on</td>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.customer.plan.actions.filter(a => a.done).map(action => {
                    return <tr key={action.id}>
                      <td className="doneColumn"><input type="checkbox" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                      <td>{action.action}</td>
                      <td className="dateColumn">{moment(action.done).format('D/M/YYYY')}</td>
                    </tr>
                  })}
                  </tbody>
                </table>
              : null}
          <CopyPasteBox customer={this.state.customer} />
        </div>
        <div className="rightColumn">
          {Object.keys(this.state.customer.vulnerabilities).length > 0
            ? <div className="suggestedActions">
                <h2>Suggested Actions</h2>
                <div className="suggestions">
                  {this.state.customer.vulnerabilities.categories.concat(defaultAction.category).map(
                    vuln => <SuggestedAction  key={vuln} vuln={vuln} vulns={vulnerabilities.concat([defaultAction])} />
                  )}
                </div>
              </div>
            : null}
        </div>
      </div>
    );
  }
}
