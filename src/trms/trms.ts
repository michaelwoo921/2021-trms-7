export class Trms {
  name: string='';
  sup_name: string='';
  role='';
  date_created: string='';
  event_name ='';
  event_type: string='';
  event_start_date: string='';
  event_end_date: string =  '';
  event_location: string='';
  event_description: string='';
  event_cost: number = 0;
  pro_reimbursement? : string| number;
  event_grading_format?: string='';
  grade ='';
  justification?='';

  attachments: string='';
  approval ={
    sup: {status:'', date:'', reason: '', additional_info:''},
    head: {status:'', date:'', reason: '', additional_info:''},
    benco: {status:'', date:'', reason: '', additional_info:''},
  };
  comments: string='';



  constructor(nam: string, dt: string){
    this.name = nam;
    this.date_created = dt;
  }
}