import _ from "lodash";

var table = {
  name: "User",
  columns: [
    {
      name: "id",
      type: "number",
    },
    {
      name: "name",
      type: "string",   
    },
    {
      name: "date_of_birth",
      type: "date", 
    },
    {
      name: "address",
      type: "string",
    },
  ],
  controller: [
    {
    method: "get",
    params: [],
    service_method: "/get" ,
    model_name: "user",
    type: "string",
    table_service: "string",
    func_name: "select",
    
    },
    {
    method: "post",
    params: [{}],
    service_method: "/insert",
    model_name: "user",
    type: "string",
    table_service: "string",
    func_name: "insert",
    },
    {
    method: "put",
    params: [{}],
    service_method: "/update" ,
    model_name: "user",
    type: "string",
    table_service: "string",
    func_name: "update",
    },
    {
    method: "delete",
    params: "number",
    service_method: "/delete",
    model_name: "user",
    type: "string",
    table_service: "string",
    func_name: "delete"
    }
],
service : [{
  method1: "select",
  parameter: "_User",
  class: "User",
  method2: "selectTranscation",
  property: "sql",
  transaction: "selectTransaction"
},
{
  method1: "insert",
  parameter: "_User",
  class: "User",
  method2: "insertTransaction",
  property: "sql",
  transaction: "insertTransaction"

},
{
  method1: "update",
  parameter: "_User",
  class: "User",
  method2: "updateTransaction",
  property: "sql",
  transaction: "updateTransaction"
}

],

service_select_transaction : [{
  method : "selectTransaction",
  parameter: "_User",
  class: "user",
  property: "sql",
  id: "`User.id",
  parameter_id : "${_User.id}`",
  condition: '`WHERE ${condition_list.join(" and ")}`',
  query: `'INSERT INTO tblUsers(
    code, name, product_id, section_reference, purpose, version_id, criticality_id, phase_id, created_by, modified_by, created_on, modified_on, version, is_active, lang_code, notes)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *; '` ,
  model: `var temp: User = new User();
  temp.id = v.id != null ? parseInt(v.id) : 0;
  temp.name = v.name;
  temp.created_on = v.created_on;
  temp.modified_on = v.modified_on;
  temp.created_by = v.created_by != null ? parseInt(v.created_by) : 0;
  temp.modified_by =
    v.modified_by != null ? parseInt(v.modified_by) : 0;
  temp.version = v.version != null ? parseInt(v.version) : 0;
  temp.notes = v.notes;
  result.push(temp);`

}],

services_insert_transaction: [{
  method : "insertTransaction",
  parameter: "_User",
  class: "user",
  property: "sql",
  id: "`User.id",
  parameter_id : "${_User.id}`",
  query: `'
  SELECT tdi.id, tdi.code, tdi.name, tdi.product_id, tdi.section_reference, tdi.purpose, tdi.version_id, tdi.criticality_id, tdi.phase_id, tdi.created_by, tdi.modified_by, tdi.created_on, tdi.modified_on, tdi.version, tdi.is_active, tdi.lang_code, tdi.notes,
  tp.name product_name,
  version.ref_value_display_text version_name,
  criticality.ref_value_display_text criticality_name,
  phase.ref_value_display_text phase_name
  FROM tblUsers tdi
  LEFT JOIN tblproduct tp on tdi.product_id = tp.id
  @condition;'
`
}],
services_update_transaction: [{
  method : "updateTransaction",
  parameter: "_User",
  class: "user",
  property: "sql",
  id: "`User.id",
  parameter_id : "${_User.id}`",
  query: `'
  UPDATE public.tblUsers
  SET code=$2, name=$3, product_id=$4, section_reference=$5, purpose=$6, version_id=$7, criticality_id=$8, phase_id=$9, modified_by=$10, modified_on=$11, version=version+1, is_active=$13, lang_code=$14, notes=$15
  WHERE id = $1 and version = $12
  RETURNING *;'
`
}]

}; 

var properties: Array<string> = [];
_.forEach(table.columns, (v) => {
var property: string = ""

  switch (v.type) {
    case "string":
      property = `${v.name}:string | null = null;`;
      break;
    case "number":
      property = `${v.name}:number = 0;`;
      break;
    case "date":
      property = `${v.name}:date | null = null;`;
      break;
    case "boolean":
      property = `${v.name}:boolean = false;` 

    default:
      break;
  }
  properties.push(property);
  let model_template: string = `
export class ${table.name}{
    ${properties.join("\n")}
}
`;

console.log(model_template);
});

  var controllers: Array<string> = [];
  _.forEach(table.controller, (v) => {
    var controller:string = "";
    var paramsval: string = "()"
    if(v.params.length > 0){
      paramsval = '(req.body.item)'
    }
  //    controller = `router.${v.method}("${v.service_method}", async (req, res, next) => {
  //     try{
  //         var result: Actionres<Array<${v.model_name}>> = new ${v.model_name}<
  //         Array<${v.model_name}>>();'
  //         var service: ${v.model_name} = new ${v.table_service}();
  //         result.item = await service.${v.func_name}${paramsval};
  //         next(result);
  //        } catch(error){
  //            next(error);
  //        }
  // })`
  // controllers.push(controller);

  // for(var i=0; i<4; i++) {
  // console.log(controllers[i])
  // }
 let controller_template: string = `router.${v.method}("${v.service_method}", async (req, res, next) => {
  try{
      var result: Actionres<Array<${v.model_name}>> = new ${v.model_name}<
      Array<${v.model_name}>>();'
      var service: ${v.model_name} = new ${v.table_service}();
      result.item = await service.${v.func_name}${paramsval};
      next(result);
     } catch(error){
         next(error);
     }
})`
console.log(controller_template)

})


var services: Array<string> = [];
_.forEach(table.service, (v) => {
  var service: string = "";
  var insert_text: string = "";
  var result: string = ""

if(v.method1 == "select"){
  insert_text ="var result: Array<User> = [];"
  result = "result =";
}

  let service_template: string = `public async ${v.method1}(
    ${v.parameter}:${v.class}
  ): Promise<Array<${v.class}>> {
    ${insert_text}
    try{
      await using(this.db.getDisposablePool(), async (pool) => {
        var client = await pool.connect();
        if (client != null) {
          ${result} await this.${v.transaction}(client, ${v.parameter});
    
  }


});
} catch(error){
  throw error;
}
return result;
}`
console.log(service_template)
})


var service_select_transactions: Array<string> = [];
_.forEach(table.service_select_transaction, (v) => {
  let service_select_Transaction: any = "";


  let service_select_Transaction_template:string = `  public async ${v.method}( 
    _client: PoolClient,
    ${v.parameter}: ${v.class}
  ): Promise<Array<${v.class}>> {
    var result: Array<${v.class}> = [];
    try {
      var query: string = ${v.query};
      var condition_list: Array<string> = [];
      if (${v.property}.id > 0) {
        condition_list.push(${v.id} = ${v.parameter_id});
      }
      if (condition_list.length > 0) {
        query = query.replace(
          /@condition/g,
          ${v.condition}
        );
      } else {
        query = query.replace(/@condition/g, "");
      }

      var { rows } = await _client.query(query);
      if (rows.length > 0) {
        _.forEach(rows, (v) => {
          var temp: DIUNMapWrapper = new DIUNMapWrapper();
          temp.id = v.id != null ? parseInt(v.id) : 0;
          temp.userneed_id =
            v.userneed_id != null ? parseInt(v.userneed_id) : null;
          temp.designinput_id =
            v.designinput_id != null ? parseInt(v.designinput_id) : null;
          temp.created_by = v.created_by != null ? parseInt(v.created_by) : 0;
          temp.modified_by =
            v.modified_by != null ? parseInt(v.modified_by) : 0;
          temp.created_on = v.created_on;
          temp.modified_on = v.modified_on;
          temp.version = v.version != null ? parseInt(v.version) : 0;
          temp.is_active = v.is_active;
          temp.lang_code = v.lang_code;
          temp.notes = v.notes;
          result.push(temp);
        });
      }
    } catch (error) {
      throw error;
    }
    return result;
  }`
      console.log(service_select_Transaction_template)
})



var services_insert_transactions: Array<string> = [];
_.forEach(table.services_insert_transaction, (v) => {
  let services_select_Transaction: any = ""; 

  let service_insert_transaction_template: string = `
  public async insertTransaction(
    _client: PoolClient,
    ${v.parameter}: ${v.class}
  ): Promise<void> {
    try {
      ${v.parameter}.created_on = new Date();
      ${v.parameter}.is_active = true;
      ${v.parameter}.version = 1;

      var { rows } = await _client.query(this.sql_insert, [

        ${v.parameter}.name,
        ${v.parameter}.product_id,
        ${v.parameter}.created_by,
        ${v.parameter}.modified_by,
        ${v.parameter}.created_on,
        ${v.parameter}.modified_on,
        ${v.parameter}.notes,
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        ${v.parameter}.id = row.id != null ? parseInt(row.id) : 0;
      }
    } catch (error) {
      throw error;
    }
  }`
console.log( service_insert_transaction_template)

})


var services_update_transactions: Array<string> = [];
_.forEach(table.services_update_transaction, (v) => {
  let services_update_Transaction: any = "";

let service_update_transaction_template: string = ` public async updateTransaction(
  _client: PoolClient,
  ${v.parameter}: ${v.class}
): Promise<void> {
  try {
    ${v.parameter}.modified_on = new Date();

    var { rows } = await _client.query(this.sql_update, [
      ${v.parameter}.name,
      ${v.parameter}.product_id,
      ${v.parameter}.created_by,
      ${v.parameter}.modified_by,
      ${v.parameter}.created_on,
      ${v.parameter}.modified_on,
      ${v.parameter}.notes,
      ]);
    if (rows.length > 0) {
      var row = rows[0];
      ${v.parameter}.id = row.id != null ? parseInt(row.id) : 0;
      ${v.parameter}.version = row.version != null ? parseInt(row.version) : 0;
    }
  } catch (error) {
    throw error;
  }
}`

console.log(service_update_transaction_template)

})

// public async insert(${v.parameter}: ${v.class}): Promise<> {${v.class}
//     try {
//       await using(this.db.getDisposablePool(), async (pool) => {
//         var client = await pool.connect();
//         if (client != null) {
//           await this.insertTransaction(client, ${v.parameter});
//         }
//       });
//     } catch (error) {
//       throw error;
//     }
//     return ${v.parameter};
//   }