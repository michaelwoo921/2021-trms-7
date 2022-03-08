import React, { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { TrmsState, UserState } from '../reducer';
import './trms.css';
import { eventRefTable } from '../eventRefTable';
import trmsService from './trms.service';
import { changeTrms } from '../actions';
import { Trms } from './trms';
import { useSelector } from 'react-redux';
import formatDate, { calculateTimeLapseInDays } from '../formatDate';
import userService from '../user/user.service';

const trmsProp = (state: TrmsState) => ({ trms: state.trms });

const mapDispatch = {
  updateTrms: (trms: Trms) => changeTrms(trms),
};

const connector = connect(trmsProp, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

function AddTrmsComponent(props: PropsFromRedux) {
  const user = useSelector((state: UserState) => state.user);

  const history = useHistory();

  function handleFormInput(e: SyntheticEvent) {
    let tr: any = { ...props.trms };
    tr[(e.target as HTMLInputElement).name] = (
      e.target as HTMLInputElement
    ).value;
    props.updateTrms(tr);
  }
  function submitForm() {
    console.log(props.trms);
    let u = { ...user };
    if (props.trms.pro_reimbursement) {
      u.fund = user.fund - Number(props.trms.pro_reimbursement);
    }
    userService
      .update(u)
      .then(() => {})
      .catch(() => {});

    trmsService.addTrms(props.trms).then(() => {
      props.updateTrms(new Trms());
      history.push('/trmss');
    });
  }

  const USER_FIELDREAD = ['name', 'role', 'sup_name', 'date_created'];

  const FIELDS = [
    'event_description',
    'event_location',
    'event_cost',
    'justification',
  ];

  let weight = 0;

  let fundAvailable = user.fund;
  return (
    <div className="col trms card" style={{ backgroundColor: '#96c0ca' }}>
      <div className=" card-body">
        {USER_FIELDREAD.map((fieldName) => {
          (props.trms as any)[fieldName] =
            fieldName === 'date_created'
              ? formatDate(new Date())
              : (user as any)[fieldName];

          return (
            <div key={'input-field-' + fieldName}>
              <label>{fieldName}</label>
              <input
                type="text"
                className="form-control"
                name={fieldName}
                id={'tr_' + fieldName}
                value={(props.trms as any)[fieldName]}
              ></input>
            </div>
          );
        })}

        <div key={'input-field-event_name'}>
          <label>event_name</label>
          <input
            type="text"
            className="form-control"
            name="event_name"
            id="tr_event_name"
            value={(props.trms as any)['event_name']}
            onChange={handleFormInput}
            placeholder="Enter your input"
          ></input>
        </div>

        <>
          {eventRefTable.map((item: any) => {
            if (props.trms['event_type'] === item.type) {
              weight = item.weight;
            }
            return null;
          })}
        </>

        <div key="input-field-event_type">
          <label>event_type</label>
          <select
            id="event_type"
            name="event_type"
            onChange={handleFormInput}
            style={{ backgroundColor: '#96c0ca', width: '100%', padding: 10 }}
          >
            {eventRefTable.map((item: any) => {
              if (props.trms['event_type'] === item.type) {
                weight = item.weight;
                if (typeof props.trms['event_cost'] === 'number') {
                  props.trms['pro_reimbursement'] =
                    props.trms['event_cost'] * weight;
                }
              }
              return (
                <option
                  value={item.type}
                  selected={item.type == 'University Courses'}
                >
                  {item.type}
                </option>
              );
            })}
          </select>
        </div>

        <div key={'input-field-event_start_date'}>
          <label>event_start_date</label>
          <input
            type="text"
            className="form-control"
            name="event_start_date"
            id="tr_event_start_date"
            placeholder="enter in format: yyyy-mm-dd"
            value={(props.trms as any)['event_start_date']}
            onChange={handleFormInput}
          ></input>
        </div>

        <div key={'input-field-event_end_date'}>
          <label>event_end_date</label>
          <input
            type="text"
            className="form-control"
            name="event_end_date"
            id="tr_event_end_date"
            placeholder="enter in format: yyyy-mm-dd"
            value={(props.trms as any)['event_end_date']}
            onChange={handleFormInput}
          ></input>
        </div>

        {FIELDS.map((fieldName) => {
          return (
            <div key={'input-field-' + fieldName}>
              <label>{fieldName}</label>
              <input
                type="text"
                className="form-control"
                name={fieldName}
                id={'tr_' + fieldName}
                value={(props.trms as any)[fieldName]}
                placeholder="Enter your input"
                onChange={handleFormInput}
              ></input>
            </div>
          );
        })}

        <div key="input-field-event_type">
          <label>event_grading_format</label>
          <br />
          <select
            id="event_grading_format"
            name="event_grading_format"
            onChange={handleFormInput}
            style={{
              backgroundColor: '#96c0ca',
              width: '100%',
              padding: 10,
            }}
          >
            <option value="letter_grade" selected>
              letter grade
            </option>
            <option value="presentation"> presentation </option>
          </select>
        </div>

        <div key={'input-field-pro_reimbursement'}>
          <label>Projected Reimbursement</label>
          <input
            type="text"
            className="form-control"
            name="pro_reimbursement"
            id="tr_pro_reimbursement"
            value={
              fundAvailable > props.trms['event_cost'] * weight
                ? props.trms['event_cost'] * weight
                : fundAvailable
            }
            onChange={handleFormInput}
          ></input>
        </div>

        <hr />

        {calculateTimeLapseInDays(
          formatDate(new Date()),
          props.trms.event_start_date
        ) > 7 ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              submitForm();
            }}
          >
            Create Trms
          </button>
        ) : (
          <p className=" text-danger mt-1">
            {' '}
            You need to submit 7 days before the event start date{' '}
          </p>
        )}
      </div>
    </div>
  );
}

//connect my prop and dispatcher to my component
export default connector(AddTrmsComponent);
