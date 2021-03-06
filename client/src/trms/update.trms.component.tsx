import { SyntheticEvent, useEffect, useState } from 'react';
import './trms.css';
import trmsService from './trms.service';

import { withRouter, useHistory } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import { TrmsState, UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { changeTrms } from '../actions';
import { Trms } from './trms';
import formatDate, { calculateTimeLapseInDays } from '../formatDate';

interface Params {
  nam: string;
  dt: string;
}

const options = [
  {
    label: 'Approve',
    value: 'approved',
  },
  {
    label: 'Reject',
    value: 'rejected',
  },
  {
    label: 'Info Needed',
    value: '',
  },
];

function UpdateTrmsComponent(props: RouteComponentProps<Params>) {
  const trmsSelector = (state: TrmsState) => state.trms;
  const trms = useSelector(trmsSelector);
  const user = useSelector((state: UserState) => state.user);

  let [appValue, setAppValue] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    console.log(props);
    console.log(props.match.params.nam, props.match.params.dt);
    trmsService
      .getTrms(props.match.params.nam, props.match.params.dt)
      .then((trms) => {
        console.log(trms);
        dispatch(changeTrms(trms));
      });
  }, [dispatch, props, props.match.params.nam, props.match.params.dt]);

  const READFIELDS = [
    'name',
    'sup_name',
    'date_created',
    'event_name',
    'event_type',
    'event_start_date',
    'event_end_date',
    'event_location',
    'event_description',
    'event_cost',
    'pro_reimbursement',
    'event_grading_format',
  ];
  const UPDATEFIELDS = ['grade', 'comment', 'attachments'];

  const READFIELDSBYSUP = [
    'name',
    'sup_name',
    'date_created',
    'event_name',
    'event_type',
    'event_start_date',
    'event_end_date',
    'event_location',
    'event_description',
    'event_cost',
    'pro_reimbursement',
    'event_grading_format',
    'grade',
    'attachments',
  ];

  const history = useHistory();

  let today = formatDate(new Date());

  function handleFormInput(e: SyntheticEvent) {
    let tr: any = { ...trms };
    tr[(e.target as HTMLInputElement).name] = (
      e.target as HTMLInputElement
    ).value;

    console.log(tr.attachments);
    dispatch(changeTrms(tr));
  }
  function submitForm() {
    if (user.role === 'Employee') {
      let tr1 = { ...trms };

      alert('trms:' + JSON.stringify(tr1.approval));
      trmsService.updateTrms(tr1).then(() => {
        dispatch(changeTrms(new Trms()));

        setTimeout(() => {
          console.log('Updating trms!');
          history.push('/trmss');
        }, 1000);
      });
    }
    if (user.role === 'Sup') {
      let tr1 = { ...trms };
      tr1.approval.sup.status = appValue;
      tr1.approval.sup.date = formatDate(new Date());

      alert('trms:' + JSON.stringify(tr1.approval));
      trmsService.updateTrms(tr1).then(() => {
        dispatch(changeTrms(new Trms()));

        setTimeout(() => {
          console.log('Updating trms!');
          history.push('/trmss');
        }, 1000);
      });
    }
    if (user.role === 'DeptHead') {
      trms.approval.head.status = appValue;
      trms.approval.head.date = formatDate(new Date());

      alert('trms:' + JSON.stringify(trms.approval));
      trmsService.updateTrms(trms).then(() => {
        dispatch(changeTrms(new Trms()));
        setTimeout(() => {
          console.log('Updating trms!');
          history.push('/trmss');
        }, 200);
      });
    }
    if (user.role === 'Benco') {
      trms.approval.benco.status = appValue;
      trms.approval.benco.date = formatDate(new Date());

      alert('trms:' + JSON.stringify(trms.approval));

      trmsService.updateTrms(trms).then(() => {
        dispatch(changeTrms(new Trms()));
        console.log('Updating trms!');

        history.push('/trmss');
      });
    }
  }
  return (
    <div className="col trms card" style={{ backgroundColor: '#96c0ca' }}>
      <div className=" card-body" style={{ backgroundColor: '#96c0ca' }}>
        {calculateTimeLapseInDays(trms['event_start_date'], today) < 14 &&
          calculateTimeLapseInDays(trms['event_start_date'], today) > 0 && (
            <div className="text-danger"> Urgent </div>
          )}

        {calculateTimeLapseInDays(trms['event_start_date'], today) > 28 &&
          trms.approval.sup.status === '' &&
          (trms.approval.sup.status = 'auto_approved') &&
          (trms.approval.sup.date = today)}

        {(trms.approval.sup.status === 'auto_approved' ||
          trms.approval.sup.status === 'approved') &&
          trms.role === 'Employee' &&
          trms.approval.head.status === '' &&
          calculateTimeLapseInDays(trms.approval.sup.date, today) > 14 &&
          (trms.approval.head.status = 'auto_approved') &&
          (trms.approval.head.date = today)}

        {(trms.approval.head.status === 'auto_approved' ||
          trms.approval.head.status === 'approved') &&
          calculateTimeLapseInDays(trms.approval.head.date, today) > 14 &&
          calculateTimeLapseInDays(trms.event_end_date, today) > 14 &&
          trms.approval.benco.status === '' && (
            <a href="mailto:king@bencosup.com">
              {' '}
              Escalation email to Benco Supervisor{' '}
            </a>
          )}

        {user.name === trms.name && (
          <>
            {' '}
            {READFIELDS.map((fieldName: any) => {
              return (
                <div key={'input-field-' + fieldName}>
                  <label>{fieldName}</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#96c0ca' }}
                    name={fieldName}
                    id={'tr_' + fieldName}
                    value={(trms as any)[fieldName]}
                  ></input>
                </div>
              );
            })}
            {UPDATEFIELDS.map((fieldName: any) => {
              return (
                <div key={'input-field-' + fieldName}>
                  <label>{fieldName}</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#96c0ca' }}
                    name={fieldName}
                    id={'tr_' + fieldName}
                    value={(trms as any)[fieldName]}
                    onChange={handleFormInput}
                  ></input>
                </div>
              );
            })}
          </>
        )}

        {((user.name === trms.sup_name &&
          trms.role === 'Employee' &&
          trms.approval.sup.status === '') ||
          (user.role === 'DeptHead' &&
            trms.role === 'Employee' &&
            (trms.approval.sup.status === 'approved' ||
              trms.approval.sup.status === 'auto_approved')) ||
          (user.role === 'DeptHead' &&
            trms.role === 'Sup' &&
            trms.approval.head.status === '') ||
          (user.role === 'Benco' &&
            (trms.approval.head.status === 'approved' ||
              trms.approval.head.status === 'auto_approved'))) && (
          <>
            {READFIELDSBYSUP.map((fieldName: any) => {
              return (
                <div key={'input-field-' + fieldName}>
                  <label>{fieldName}</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: '#96c0ca' }}
                    name={fieldName}
                    id={'tr_' + fieldName}
                    value={(trms as any)[fieldName]}
                  ></input>
                </div>
              );
            })}
            <div key={'input-field-comments'}>
              <label>Comment</label>
              <input
                type="text"
                className="form-control"
                style={{ backgroundColor: '#96c0ca' }}
                name="comments"
                id={'tr_comments'}
                value={(trms as any)['comments']}
                onChange={handleFormInput}
              ></input>
            </div>

            <div key={'input-field-approval'}>
              <label className="mr-3">Approve</label>

              <select
                value={appValue}
                onChange={(e) => {
                  setAppValue(e.target.value);
                }}
                style={{ backgroundColor: '#96c0ca' }}
              >
                {options.map((option) => (
                  <option value={option.value}> {option.label}</option>
                ))}
              </select>
            </div>
          </>
        )}
        {
          <button className="btn btn-primary" onClick={submitForm}>
            Update Trms
          </button>
        }
      </div>
    </div>
  );
}

export default withRouter(UpdateTrmsComponent);
