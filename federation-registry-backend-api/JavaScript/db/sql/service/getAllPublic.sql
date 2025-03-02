SELECT json_build_object('id',sd.id,'service_name', sd.service_name,'service_description',sd.service_description,
						 'logo_uri',sd.logo_uri,'policy_uri',sd.policy_uri,'integration_environment',sd.integration_environment,'protocol',sd.protocol,
						 'country',sd.country,'website_url',sd.website_url,'tenant',sd.tenant,'organization_name',sd.name,'organization_url',sd.url,'organization_id',sd.organization_id,
						  'service_coc',(SELECT CASE WHEN  json_object_agg(v.name,v.value) IS NULL THEN NULL ELSE  json_object_agg(v.name,v.value) END
						 FROM service_coc v WHERE sd.id = v.service_id),'created_at',created_at,
						 'contacts',
						 	(SELECT json_agg(json_build_object('email',v.value,'type',v.type))
							 FROM service_contacts v WHERE sd.id = v.owner_id)
							) json
    FROM (SELECT *
	FROM ((SELECT id,created_at FROM service_state WHERE state!='deleted') AS bar LEFT JOIN service_details USING (id) ) AS foo LEFT JOIN organizations USING(organization_id) WHERE tenant=${tenant}) as sd
