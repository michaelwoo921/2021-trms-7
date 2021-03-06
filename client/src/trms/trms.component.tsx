import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './trms.css';
import { Trms } from './trms';
import formatDate, { calculateTimeLapseInDays } from '../formatDate';

interface TrmsProps {
  data: Trms;
}

function TrmsComponent(props: TrmsProps) {
  const history = useHistory();

  function goToTrms() {
    history.push('/trmss/' + props.data.name + '/' + props.data.date_created);
  }
  const timeLapse: number = calculateTimeLapseInDays(
    props.data.event_start_date,
    formatDate(new Date())
  );

  return (
    <div className="col trms card" style={{ backgroundColor: '#96c0ca' }}>
      <div className="card-head" style={{ fontWeight: 'bold' }}>
        TRMS form submitted:
      </div>
      <div className="card-body" style={{ border: 'solid' }}>
        <p>Created by: {props.data.name}</p>

        <p>Submission Date: {props.data.date_created}</p>
        <p>Event Name: {props.data.event_name}</p>
        <p>Event Type: {props.data.event_type}</p>
        <p>Event starts: {props.data.event_start_date}</p>

        <h4>Approval Status:</h4>

        {props.data.role === 'Employee' ? (
          <p>
            {' '}
            Status:{' '}
            {props.data.approval.sup.status === '' ? (
              <span style={{ color: 'red' }}>Not reviewed </span>
            ) : (
              <span style={{ color: 'green' }}>
                {props.data.approval.sup.status}
              </span>
            )}{' '}
            by {props.data.sup_name}{' '}
          </p>
        ) : (
          ''
        )}
        <p>
          {' '}
          Status:{' '}
          {props.data.approval.head.status === '' ? (
            <span style={{ color: 'red' }}>Not reviewed </span>
          ) : (
            <span style={{ color: 'green' }}>
              {props.data.approval.head.status}
            </span>
          )}{' '}
          by Department Head{' '}
        </p>
        <p>
          {' '}
          Status:{' '}
          {props.data.approval.benco.status === '' ? (
            <span style={{ color: 'red' }}>Not reviewed </span>
          ) : (
            <span style={{ color: 'green' }}>
              {props.data.approval.benco.status}
            </span>
          )}{' '}
          by Benco{' '}
        </p>

        <p>
          {' '}
          Approval additional Info:
          {props.data.approval.sup.additional_info}
          <br />
          {props.data.approval.head.additional_info}
          <br />
          {props.data.approval.benco.additional_info}
        </p>

        <p className="text-danger">
          {' '}
          {timeLapse > 0 &&
            timeLapse < 14 &&
            `Urgent: Course started  ${timeLapse} days ago. Please approve`}
        </p>

        <Link to={`/trmss/${props.data.name}/${props.data.date_created}`}>
          {' '}
          See more info{' '}
        </Link>
      </div>
    </div>
  );
}

export default TrmsComponent;
