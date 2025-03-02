import React,{useState,useEffect,useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckSquare,faTimes,faSync,faSignOutAlt,faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import ServiceForm from "./ServiceForm.js";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import config from './config.json';
import InputGroup from 'react-bootstrap/InputGroup';
import {useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import {LoadingBar,ProcessingRequest} from './Components/LoadingBar';
import * as yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import {Logout,NotFound} from './Components/Modals';
import {userContext} from './context.js';
import {ConfirmationModal} from './Components/Modals';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


const GroupsPage = (props) => {
  let {tenant_name,group_id,service_id,petition_id} = useParams();
  const [logout,setLogout] = useState(false);
  const [notFound,setNotFound] = useState(false);
  const [isGroupManager,setIsGroupManager] = useState(false);
  useEffect(()=>{
    localStorage.removeItem('url');
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const user = useContext(userContext);
  const [group_managers,setGroupManagers] = useState();
  const [invitationResult,setInvitationResult] = useState();
  const [sending,setSending] = useState();
  const [loading,setLoading] = useState();
  const [group,setGroup] = useState([]);
  const [email,setEmail] = useState('');
  const [service,setService] = useState('');
  const [role,setRole] = useState('member');
  const [error,setError] = useState('');
  const [confirmationData,setConfirmationData] = useState({});
  const [invitations,setInvitations] = useState([]);
  const getData = () => {
    getGroupMembers();
    getInvites();
    getService();
  }

  const getService = () =>{
    if(!service_id){
      fetch(config.host+'tenants/'+tenant_name+'/petitions/'+petition_id+'?type=open', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        credentials: 'include', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(response=>{

        if(response.status===200){
          return response.json();
        }
        else if(response.status===401){
          setLogout(true);
          return false;
        }
        else if(response.status===404){
          setNotFound(true);
          return false;
        }
        else {
          return false
        }
      }).then(response=> {
        if(response){
          setService(response.petition);
        }
      });
    }
    else{      
      fetch(config.host+'tenants/'+tenant_name+'/services/'+service_id, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        credentials: 'include', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(response=>{
        if(response.status===200){
          return response.json();
        }
        else if(response.status===401){
          setLogout(true);
          return false;
        }
        else if(response.status===404){
          setNotFound(true);
          return false;
        }
        else {
          return false;
        }
      }).then(response=> {
        if(response.service){
          setService(response.service);
        }
      });
    }
  }


  const getGroupMembers = () => {
    setLoading(true);
    fetch(config.host+'tenants/'+tenant_name+'/groups/'+group_id+'/members', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
      }}).then(response=>{
        if(response.status===200){
          return response.json();
        }
        else if(response.status===401){
          setLogout(true);
          return false;
        }
        else if(response.status===404){
          setNotFound(true);
          return false;
        }
        else {
          return false
        }
      }).then(response=> {
        if(response){
          let count = 0;
          let group_manager = user[0].actions.includes('invite_to_group');
          response.group_members.forEach((member, i) => {
            if(member.sub===user[0].sub){
              group_manager = true;
            }
            if(member.group_manager){
              count = count +1;
            }
          });
          setIsGroupManager(group_manager);
          setGroupManagers(count);
          setGroup(response.group_members);
          setLoading(false);
        }
    });
  }
  const getInvites = () => {

    fetch(config.host+'tenants/'+tenant_name+'/groups/'+group_id+'/invitations', {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
      }}).then(response=>{
        if(response.status===200){
          return response.json();
        }
        else if(response.status===401){
          setLogout(true);
          return false;
        }
        else if(response.status===404){
          setNotFound(true);
          return false;
        }
        else {
          return false
        }
      }).then(response=> {
        if(response){
          setInvitations(response.invitations);
        }

    });
  }

  const cancelInvitation = (id,group_id)=>{
    setSending(true);
    fetch(config.host+'tenants/'+tenant_name+'/groups/'+group_id+'/invitations/'+id, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    }).then(response=> {
      setSending(false);
      getData()
    });
  }

  const resendInvitation = (id,group_id,email) => {
    setSending(true);
    fetch(config.host+'tenants/'+tenant_name+'/groups/'+group_id+'/invitations/'+id, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    }).then(response=>{
      if(response.status===200){
        return true;
      }
      else if(response.status===401){
        setLogout(true);
        return false;
      }
      else if(response.status===404){
        setNotFound(true);
        return false;
      }
      else {
        return false
      }
    }).then(response=> {
      setSending(false);
      setInvitationResult({success:response,email:email});
      getData()
    });
  }

  const sendInvitation = (invitation) => {
    setSending(true);
    fetch(config.host+'tenants/'+tenant_name+'/groups/'+invitation.group_id+'/invitations', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body:JSON.stringify(invitation)
    }).then(response=>{
      if(response.status===200){
        return true;
      }
      else if(response.status===401){
        setLogout(true);
        return false;
      }
      else if(response.status===404){
        setNotFound(true);
        return false;
      }
      else {
        return false
      }
    }).then(response=> {
      setSending(false);
      setInvitationResult({success:response,email:invitation.email});
      getData();
    });
  }

  const removeMember = (sub,group_id) => {
    setSending(true);
    fetch(config.host+'tenants/'+tenant_name+'/groups/'+group_id+'/members/'+sub, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body:JSON.stringify({sub:sub,group_id:group_id})
    }).then(response=> {
      setSending(false);
      getData()
    });
  }




  // eslint-disable-next-line
  const { t, i18n } = useTranslation();
  let schema = yup.object({
    email:yup.string().email(t('yup_email')).required(t('yup_contact_empty')),
    role:yup.string().test('testRole','Select a role',function(value){return ['member','manager'].includes(value)}).required('Select a role')
  });
  const checkError = async () => {
    setError('');
    return await schema.validate({email:email,role:role}).then(()=>{
      let valid = true;
      invitations.forEach(invitation=>{
        if(invitation.invitation_email===email){
          setError('Invite already send to this email');
          valid = false;
        }
      })
      return valid;
    }).catch(function(value){
      setError(value.errors[0]);

      return false;
    });
  }


  const sendInvite = async () => {
        let test = await checkError();
        if(test){
          sendInvitation({email:email,group_manager:(role==='manager'),group_id:group_id});
        }
  }


  return(
    <React.Fragment>
    <NotFound notFound={notFound}/>
    <Logout logout={logout}/>
    <ConfirmationModal active={confirmationData.action?true:false} setActive={setConfirmationData} action={()=>{if(confirmationData.action==='cancel'){cancelInvitation(...confirmationData.args)}else{removeMember(...confirmationData.args)}}} title={confirmationData.title} message={confirmationData.message} accept={'Yes'} decline={'No'}/>

      <ProcessingRequest active={sending}/>
     
      <Tabs className="manage_owners_tabs" defaultActiveKey="owners" id="uncontrolled-tab-example">

                  <Tab eventKey="owners" title="View Owners">
                    <LoadingBar loading={loading}>
                      
                      
                      <h2 className="group_page_main_title">{isGroupManager?"Owners Group Managment Page":"Owners Group Page"}</h2>
                        <p>Owner group members can view, edit and create service requests for this service. Owner group managers can also manage the members of this owners group by inviting or removing users.</p>
                    
                      <h4 className="group_title">Group Members</h4>
                        <Table striped bordered hover size='sm' className="groups-table">
                          <thead>
                            <tr>
                              <th>{t('username')}</th>
                              <th>Email</th>
                              <th>{t('is_group_manager')}</th>
                              {isGroupManager?<th>Action</th>:null}
                            </tr>
                          </thead>
                          <tbody>
                          {group.map((member,index)=>{

                              return (
                                <tr key={index}>
                                <td>{member.username}</td>
                                <td><a href={'mailto:'+member.email}>{member.email}</a></td>
                                <td>{member.group_manager?<FontAwesomeIcon icon={faCheckSquare}/>:null}</td>
                                {isGroupManager?<td>
                                <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                    {group_managers<2&&member.group_manager?"Can't remove user, at least one group manager must remain in the group":user[0].sub===member.sub?'Leave Group':member.pending?'Cancel Invitation':'Remove Member'}
                                    </Tooltip>
                                  }
                                >
                                <Button
                                variant="danger"
                                className={user[0].sub===member.sub?'leave-group-button':''}
                                onClick={()=>{
                                  setConfirmationData({
                                    action:'remove',
                                    args:[member.sub,member.group_id],
                                    message:(member.sub!==user[0].sub?
                                      <React.Fragment>
                                        <table style={{border:'none'}} className="confirmation-table">
                                        <tbody>
                                        <tr>
                                        <td>username:</td>
                                        <td>{member.username}</td>
                                        </tr>
                                        <tr>
                                        <td>email:</td>
                                        <td>{member.email}</td>
                                        </tr>
                                        <tr>
                                        <td>role:</td>
                                        <td>{member.group_manager?'group_manager':'group_member'}</td>
                                        </tr>
                                        </tbody>
                                        </table>
                                      </React.Fragment>
                                      :null
                                    ),
                                    title:(member.sub===user[0].sub?'Are you sure you want to leave the owners group?':'Are you sure you want to remove following user from owners group')
                                  });
                                }}
                                disabled={group.length<1||(group_managers<2&&member.group_manager)}
                                >
                                <FontAwesomeIcon icon={user[0].sub===member.sub?faSignOutAlt:faTimes} />
                                </Button>
                                </OverlayTrigger>
                                </td>:null}
                                </tr>
                              )

                          })}
                          {group.length<1?<tr><td colSpan="4">No Group Members</td></tr>:null}
                          </tbody>
                        </Table>
                        {
                          isGroupManager?
                          <React.Fragment>
                          <h4 className="group_title">Group Invites</h4>
                          <Table striped bordered hover size='sm' className="groups-table groups-invite-table">
                            <thead>
                              <tr>
                                <th>
                                  Username
                                </th>
                                <th>
                                  User Email
                                </th>
                                <th>
                                  Manager
                                </th>
                                <th>
                                  Sent to
                                </th>
                                <th>
                                  Invitation Date
                                </th>
                                <th>
                                  Expired
                                </th>
                                <th>
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                                  {invitations.length>0?invitations.map((member,key)=>{
                                      return (
                                        <tr key={key}>
                                          <td colSpan={!member.username?"2":"1"}>{member.username?member.username:'Not linked to account'}</td>
                                          {member.email?<td><a href={'mailto:'+member.email}>{member.email}</a></td>:null}
                                          <td>{member.group_manager?<FontAwesomeIcon icon={faCheckSquare}/>:null}</td>
                                          <td><a href={'mailto:'+member.invitation_email}>{member.invitation_email}</a></td>
                                          <td>{member.invitation_date.slice(0,10)}</td>
                                          <td>{member.expired?
                                          <OverlayTrigger
                                          placement='top'
                                          overlay={
                                            <Tooltip id={`tooltip-top`}>
                                              {'This invitation has expired, you can renew the invitation by using the resend button.'}
                                            </Tooltip>
                                          }
                                          >
                                          <FontAwesomeIcon className='warning-red' icon={faExclamationTriangle}/>
                                          </OverlayTrigger>:null}</td>
                                          <td>
                                            <OverlayTrigger
                                            placement='top'
                                            overlay={
                                              <Tooltip id={`tooltip-top`}>
                                                Cancel Invitation
                                              </Tooltip>
                                            }
                                            >
                                              <Button
                                                variant="danger"
                                                onClick={()=>{
                                                  setConfirmationData({
                                                    action:'cancel',
                                                    args:[member.invitation_id,member.group_id],
                                                    message:
                                                    <React.Fragment>
                                                      <table style={{border:'none'}} className="confirmation-table">
                                                      {member.username?
                                                        <tr>
                                                        <td>username:</td>
                                                        <td>{member.username}</td>
                                                        </tr>
                                                        :null}
                                                        <tr>
                                                          <td>email:</td>
                                                          <td><a href={'mailto:'+(member.email?member.email:member.invitation_email)}>{member.email?member.email:member.invitation_email}</a></td>
                                                        </tr>

                                                        <tr>
                                                          <td>role:</td>
                                                          <td>{member.group_manager?'group_manager':'group_member'}</td>
                                                        </tr>
                                                      </table>
                                                    </React.Fragment>
                                                    ,
                                                    title:'Are you sure you want to cancel this invitation?'
                                                  })
                                                }}
                                              >
                                                <FontAwesomeIcon icon={faTimes} />
                                              </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                            placement='top'
                                            overlay={
                                              <Tooltip id={`tooltip-top`}>
                                                {member.sub?'Invitation is linked to an account':'Resend Invitation'}
                                              </Tooltip>
                                            }
                                            >
                                            <Button disabled={member.sub?true:false} variant="primary" onClick={()=>{resendInvitation(member.invitation_id,member.group_id,member.invitation_email)}}><FontAwesomeIcon icon={faSync}/></Button>
                                            </OverlayTrigger>
                                          </td>
                                        </tr>
                                      )
                                  }):<tr><td colSpan="7">No pending invitations</td></tr>}

                            </tbody>
                          </Table>
                        </React.Fragment>
                        :null
                        }
                        {invitationResult?
                          <Alert variant={invitationResult.success?'success':'danger'}>
                            {invitationResult.success?t('invitation_success'):t('invitation_error')}{invitationResult.email}
                          </Alert>:null
                        }
                        {isGroupManager||user[0].actions.includes('invite_to_group')?
                          <React.Fragment>
                            <h4 className="group_title">Send Invites</h4>
                            <Row className="group_invite_row">
                              <InputGroup className={error?'invalid-input mb-3':'mb-3'}>
                                <Form.Control
                                  value={email}
                                  onChange={(e)=>{setEmail(e.target.value);}}
                                  onFocus={()=>{setInvitationResult(null);}}
                                  onBlur={()=>{checkError();}}
                                  column="true"
                                  lg='2'
                                  type="text"
                                  className='col-form-label.sm'
                                  placeholder={t('yup_email')}
                                />
                                <InputGroup.Prepend>
                                    <Form.Control as="select" value={role} className="input-hide" onChange={(e)=>{
                                      setRole(e.target.value)
                                    }}>
                                      <option key='member' value='member'>{t('group_member')}</option>
                                        <option key='manager' value='manager'>{t('group_manager')}</option>
                                    </Form.Control>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                    <Button
                                      variant="outline-primary"
                                      onClick={()=>{
                                        sendInvite();
                                      }}
                                    >
                                      {t('group_send_invitation')}
                                    </Button>
                                </InputGroup.Prepend>
                              </InputGroup>
                            </Row>
                            <div className='invitation-error'>
                              {error}
                            </div>
                          </React.Fragment>
                        :null}


                      </LoadingBar>

                  </Tab>
                  <Tab eventKey="service" title="View Service">
                    {service?<ServiceForm initialValues={service} disabled={true} {...props}/>:<LoadingBar/>}
                  </Tab>
      </Tabs>
      </React.Fragment>
  )
}
export default GroupsPage;
