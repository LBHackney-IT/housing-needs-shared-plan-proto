import React, { Component } from 'react';
import {FetchCustomer, UpdateCustomer} from '../../Gateways';
import vulnerabilities from '../../vulnerabilities';
import defaultAction from '../../DefaultAction';
import {Link} from 'react-router-dom';
import moment from 'moment';
import { username } from '../../lib/Cookie';
import { Redirect } from 'react-router-dom';
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

export default class PlanPage extends Component {
  state = {
    customer: null,
    newAction: ''
  }
  
  componentDidMount() {
    FetchCustomer(this.props.match.params.id)
      .then(customer => {
        if(!customer.plan) customer.plan = { actions: [] };
        this.setState({ customer, editingGoal: (!customer.plan.goal) });
      })
      .catch(err => {
          if(err.message === 'NotFoundError'){
            this.setState({ customer: { plan: { actions: [] }, vulnerabilities: {}, customerId: this.props.match.params.id } });
          }else{
            this.setState({redirect: '/login'})
          }
      });
  }

  save = () => {
    UpdateCustomer(this.props.match.params.id, this.state.customer)
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
        addedBy: username(),
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

  deleteAction = (e) => {
    const conf = window.confirm;
    if(conf("Are you sure you want to delete this action?")){
      const customer = this.state.customer;
      customer.plan.actions = customer.plan.actions.filter(action => action.id !== e.target.dataset.actionid);
      this.setState({ customer }, this.save)
    }
  }

  editAction = (e) => {
    this.setState({ editingAction: e.target.dataset.actionid })
  }

  editActionUpdate = (e) => {
    console.log(e.target.value);
    const customer = this.state.customer;
    const actionId = e.target.dataset.actionid;
    console.log(actionId)
    for(let action of customer.plan.actions) {
      if(action.id === actionId){
        console.log(action);
        action.action = e.target.value;
      }
    }
    this.setState({ customer })
  }

  editActionSave = (e) => {
    this.setState({ editingAction: null }, this.save)
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') this.editActionSave(e)
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

    const vulnCategories = (this.state.customer.vulnerabilities && this.state.customer.vulnerabilities.categories) || []

    return (
      <div className="lbh-container PlanPage">
        <div className="leftColumn">
          <a className="backLink" href="https://beta.singleview.hackney.gov.uk">&lt;&lt; Back to Single View</a>
          <Link to={`/customers/${this.props.match.params.id}/plan/share`} className="share button">Share</Link>
          <h2>Create a shared plan</h2>
          <h3>Goal</h3>
          {this.state.customer.plan.goal && !this.state.editingGoal
            ? <div className="goal">
                <p>{this.state.customer.plan.goal}</p>
                <button className="button" onClick={this.editGoal}>Edit</button>
              </div>
            : <div className="goal">
                <input type="text" onChange={this.updateGoal} value={this.state.customer.plan.goal}></input>
                <button className="button" onClick={this.saveGoal}>Save</button>
              </div>}

        <h2>Steps we can both take</h2>
          <div className="newAction">
            <input type="text" onChange={this.updateNewAction} value={this.state.newAction}></input>
            <button className="button" onClick={this.addNewAction}>Save</button>
          </div>
          {this.state.customer.plan.actions.filter(a => !a.done).length > 0
            ? <table className="actions actionsTodo">
                <thead>
                  <tr>
                    <td className="doneColumn"></td>
                    <td></td>
                    <td className="dateColumn">Agreed on</td>
                    <td className="addedByColumn">Created by</td>
                    <td className="buttonColumn"></td>
                    <td className="buttonColumn"></td>
                  </tr>
                </thead>
                <tbody>
                {this.state.customer.plan.actions.filter(a => !a.done).map(action => {
                  return <tr key={action.id}>
                    <td><input type="checkbox" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                    
                    <td>{this.state.editingAction && this.state.editingAction === action.id
                    ? <input className="editInput" onChange={this.editActionUpdate} onKeyPress={this.handleKeyPress} data-actionid={action.id} onBlur={this.editActionSave} value={action.action}/>
                    : action.action}</td>
                    <td>{moment(action.date).format('D/M/YYYY')}</td>
                    <td>{action.addedBy}</td>
                    <td><button className="buttonLink" data-actionid={action.id} onClick={this.editAction}>Edit</button></td>
                    <td><button className="buttonLink delete" data-actionid={action.id} onClick={this.deleteAction}>Delete</button></td>
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
                      <td className="addedByColumn">Created by</td>
                      <td className="buttonColumn"></td>
                      <td className="buttonColumn"></td>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.customer.plan.actions.filter(a => a.done).map(action => {
                    return <tr key={action.id}>
                      <td className="doneColumn"><input type="checkbox" data-actionid={action.id} onChange={this.changeActionState} checked={!!action.done}></input></td>
                      <td>{action.action}</td>
                      <td className="dateColumn">{moment(action.done).format('D/M/YYYY')}</td>
                      <td>{action.addedBy}</td>
                      <td><button className="buttonLink" data-actionid={action.id} onClick={this.editAction}>Edit</button></td>
                      <td><button className="buttonLink delete" data-actionid={action.id} onClick={this.deleteAction}>Delete</button></td>
                    </tr>
                  })}
                  </tbody>
                </table>
              : null}
        </div>
        <div className="rightColumn">
          <div className="suggestedActions">
            <h2>Suggested Actions</h2>
            <div className="suggestions">
              {vulnCategories.concat(defaultAction.category).map(
                vuln => <SuggestedAction  key={vuln} vuln={vuln} vulns={vulnerabilities.concat([defaultAction])} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
