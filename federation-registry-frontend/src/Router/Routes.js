import React,{useContext,useEffect} from 'react';
import {Switch,Route,Redirect,Link} from 'react-router-dom';
import Home from '../Home';
import ServiceList from '../ServiceList.js';
import {EditService,NewService,ViewService,CopyService} from '../FormHandler.js';
import UserInfo from '../Components/UserInfo.js';
import {HistoryList,HistoryRequest} from '../Components/History.js';
import {Callback} from '../Components/Callback.js';
import {InvitationRoute,InvitationNotFound} from '../Components/InvitationRoute.js';
import GroupsPage from '../Groups.js';
import InvitationsPage from '../Invitations.js'
import {tenantContext,userContext} from '../context.js';
import {PageNotFound,TenantHandler} from '../Components/TenantHandler.js';
import UserHandler from '../Components/UserHandler.js';
import BroadcastNotifications from '../Components/BrodcastNotifications.js'; 
import OutdatedNotifications from '../Components/OutdatedNotifications.js'; 

//import { useParams } from "react-router-dom";



const Routes = (props) => {
  const tenant = useContext(tenantContext);

  return(
  <div className="content-container">
    <Switch>
      <Route exact path='/404' component={PageNotFound} />
      <Route exact path="/:tenant_name/code/:code">
        <Callback/>
      </Route>
      <TenantRoute path="/:tenant_name/home">
        <Home/>
      </TenantRoute>
      <Route path="/:tenant_name/invitation/:code">
        <InvitationRoute/>
      </Route>
      <ProtectedRoute user={props.user} path="/:tenant_name/invitation_error">
        <InvitationNotFound/>
      </ProtectedRoute>
      <ProtectedRoute exact path="/:tenant_name/services">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          {props.t('link_petitions')}
        </div>
        <ServiceList/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/userinfo">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
           View User Profile
        </div>
        <UserInfo user={props.user} />
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/form/copy">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          New Service
        </div>
        <CopyService user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/form/new">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          New Service
        </div>
        <NewService user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/invitations">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          Invitations
        </div>
        <InvitationsPage/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/services/:service_id/edit">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          Edit Service
        </div>
        <EditService user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/notifications/broadcast" actions={['send_notifications']} >
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          Send Broadcast Notifications
        </div>
        <BroadcastNotifications user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/notifications/outdated" actions={['send_notifications']} >
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          Send Outdated Notifications
        </div>
        <OutdatedNotifications user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/requests/:petition_id/edit">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          Edit Service
        </div>
        <EditService user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/services/:service_id/requests/:petition_id/edit">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          Edit Service
        </div>
        <EditService user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/requests/:petition_id/groups/:group_id">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          {props.t('group_page')}
        </div>
        <GroupsPage/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/services/:service_id/groups/:group_id">
        <div className="links">
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
          <span className="link-seperator">/</span>
          <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
          <span className="link-seperator">/</span>
          {props.t('group_page')}
        </div>
        <GroupsPage/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path='/:tenant_name/services/:service_id/history'>
        <HistoryList user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path='/:tenant_name/services/:service_id/requests/:petition_id/history'>
        <HistoryRequest user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path='/:tenant_name/requests/:petition_id/history'>
        <HistoryRequest user={props.user}/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/services/:service_id/requests/:petition_id/review" admin={true}>
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            Review
          </div>
          <EditService review={true} user={props.user} />
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/requests/:petition_id/review" admin={true}>
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            Review
          </div>
          <EditService review={true} user={props.user} />
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/services/:service_id">
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            View Service
          </div>
          <ViewService/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/services/:service_id/requests/:petition_id">
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            View Service
          </div>
          <ViewService/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} exact path="/:tenant_name/requests/:petition_id">
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            View Service
          </div>
          <ViewService/>
      </ProtectedRoute>
      <ProtectedRoute user={props.user} path="/:tenant_name/form/view">
          <div className="links">
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/home"}>{props.t('link_home')}</Link>
            <span className="link-seperator">/</span>
            <Link to={"/"+ (tenant&&tenant[0]?tenant[0].name:null) +"/services"}>{props.t('link_petitions')}</Link>
            <span className="link-seperator">/</span>
            View Service
          </div>
          <ViewService/>
      </ProtectedRoute>
      <Redirect from="/:tenant_name" to="/:tenant_name/home"/>
      <Redirect from='*' to='/404' />
    </Switch>
  </div>
);
};



const TenantRoute = (props) => {
  const tenant = useContext(tenantContext);
  const user = useContext(userContext);

  const childrenWithProps = React.Children.map(props.children, child =>
      React.cloneElement(child, {...props.location.state})
    );

  return (
    <Route
      path={props.path}
      render={({ location }) =>
        !(tenant && tenant[0] && (props.computedMatch.params.tenant_name === tenant[0].name)) ?(
          <TenantHandler/>
        ) :
        localStorage.getItem('token')&&!(user&&user[0])? 
        <UserHandler/>:
        (
          childrenWithProps
        ) 
      }
    />
  );
}



const ProtectedRoute= (props)=> {
  const user = useContext(userContext);
  const tenant = useContext(tenantContext);
  //let {tenant_name} = useParams();

  useEffect(()=>{
    if(!(tenant&&tenant[0]&&tenant[0].name)||!(user&&user[0])){
      localStorage.setItem('url', props.location.pathname);
    }
  },[props.location.pathname,tenant,user]);

  const authorisedActions = (actions) =>{
    let authorized = true;
    if(props.actions && props.actions.length>0){
      props.actions.forEach(action=>{
        if(!actions.includes(action)){
          authorized = false
        }
      
      })
    }
    return authorized;
  }
  const childrenWithProps = React.Children.map(props.children, child =>
      React.cloneElement(child, {...props.location.state})
    );
  return (
    <Route
      path={props.path}
      render={({ location }) =>
        !(tenant && tenant[0] && (props.computedMatch.params.tenant_name === tenant[0].name)) ?
        <TenantHandler/>:
        //localStorage.getItem('user')
        // user && user[0] && (!(props.admin && !user[0].review)||props.location.state.integration_environment==='development')
        localStorage.getItem('token')&&!(user&&user[0])? 
          <UserHandler/>:
        localStorage.getItem('token')&&(user&&user[0])&&(!props.actions||authorisedActions(user[0].actions))?
        (
          childrenWithProps
        ) : (
          <Redirect
            to={{
              pathname: "/"+tenant[0].name+"/home",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}



export default Routes;
