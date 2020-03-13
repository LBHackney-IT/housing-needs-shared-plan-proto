import React, { Component } from 'react';
import {ShareCustomerPlan} from '../../Gateways';
import {Link} from 'react-router-dom';
import './index.css';

export default class SharePlanPage extends Component {
  state = {
    details: {},
    shared: false
  }
  
  sharePlan = () => {
    if(this.state.details.name && this.state.details.number){
      ShareCustomerPlan(this.props.match.params.id, this.state.details)
        .then(() => {
          this.setState({shared: true})
        })
    }
  }

  updateDetails = (e) => {
    let details = this.state.details;
    details[e.target.name] = e.target.value;
    this.setState({ details });
  }

  render() {
    if(this.state.shared) return (
      <div className="lbh-container SharePlanPage">
        <h2>Share plan</h2>
        <p>The plan has been shared. <Link to={`/customers/${this.props.match.params.id}/plan`}>Back to plan</Link></p>
      </div>
    );

    return (
      <div className="lbh-container SharePlanPage">
        <h2>Share plan</h2>
        <label>Customer Name</label>
        <input type="text" name="name" onChange={this.updateDetails}></input>
        <label>Mobile number</label>
        <input type="text" name="number" onChange={this.updateDetails}></input>
        <button className="button" onClick={this.sharePlan}>Share</button>
      </div>
    );
  }
}
