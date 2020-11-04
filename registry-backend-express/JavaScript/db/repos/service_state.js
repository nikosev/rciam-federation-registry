const sql = require('../sql').service_state;
let cs= {};

class ServiceStateRepository {
  constructor(db,pgp){
    this.db = db;
    this.pgp = pgp;
    // set-up all ColumnSet objects, if needed:
     cs = new pgp.helpers.ColumnSet(['?id','state'],{table:'service_state'});
  }

  async add(id,state){
    return this.db.any(sql.add,{
      id:+id,
      state:state
    });
  }
  async update(id,state){
    return this.db.any(sql.update,{
      id:+id,
      state:state
    })
  }


  async deploymentUpdate(messages){
    let updateState=[];
    let updateClientId =[];
    let updateExternalId = [];
    let ids=[];
    let batch_queries = [];
    return this.db.task('deploymentTasks', async t => {
      for(let index=0;index<messages.length;index++){
        //let decoded_message= JSON.parse(Buffer.from(messages[index].message.data, 'base64').toString());

        let decoded_message=messages[index];
        let done = await t.deployment_tasks.resolveTask(decoded_message.id,decoded_message.agent_id,decoded_message.state);
        let deployed = await t.deployment_tasks.isDeploymentFinished(decoded_message.id);
        // If we have a an error or if the deployment has finished we have to update the service state
        if(deployed || decoded_message.state==='error'){
          updateState.push({id:decoded_message.id,state:decoded_message.state});
          if(decoded_message.external_id){
            updateExternalId.push({id:decoded_message.id,external_id:decoded_message.external_id});
          }
          if(decoded_message.client_id){
            updateClientId.push({id:decoded_message.id,client_id:decoded_message.client_id});
          }
          if(deployed){
            ids.push(decoded_message.id);
          }
        }
      }
      if(updateClientId.length>0){
        batch_queries.push(t.service_details_protocol.updateClientId(updateClientId));
      }
      if(updateExternalId.length>0){
        batch_queries.push(t.service_details_protocol.updateExternalId(updateExternalId));
      }
      if(updateState.length>0){
        batch_queries.push(t.service_state.updateMultiple(updateState));
      }
      if(batch_queries.length>0){
        let batch_result = await t.batch(batch_queries).catch(err=>{
          throw err;
        });
      }
      return ids;

    });
  }

  async updateMultiple(updateData){
    // updateData = [{id:1,state:'deployed'},{id:2,state:'deployed'},{id:3,state:'failed'}];
    const update = this.pgp.helpers.update(updateData, cs) + ' WHERE v.id = t.id RETURNING t.id';
    //=> UPDATE "service_data" AS t SET "state"=v."state"
    //   FROM (VALUES(1,'deployed'),(2,'deployed'),(3,'failed'))
    //   AS v("id","state") WHERE v.id = t.id
    return await this.db.any(update).then((ids)=>{
      if(ids.length===updateData.length){
        return true
      }
      else{
        throw 'Could not update service state';
      }
    });
  }






}

module.exports = ServiceStateRepository;
