const FUNCTIONS 		= require('firebase-functions');
const ADMIN     		= require('firebase-admin');
const SERVICE_ACCOUNT 	= require("./nieveseats-firebase-adminsdk-lu3vq-b8c6651e39.json");
const DB_URL			= "https://nieveseats.firebaseio.com";
const L					= console.log;

ADMIN.initializeApp({
  credential: ADMIN.credential.cert(SERVICE_ACCOUNT),
  databaseURL: DB_URL
});

const DB = ADMIN.firestore();

DB.settings({
    timestampsInSnapshots: true
});

exports.save_order_1 = FUNCTIONS.https.onCall((data, context) => {

  L('save_order_1 :in: data >> ',data);
  
  const entity = data.entity;  
  const service = data.service;
  const status = data.status;
  const table = data.table || '';
  const total = data.total;
  const orderId = data.order_id || '';
  const token = typeof context.auth !== 'undefined' && 
				typeof context.auth.uid !== 'undefined'
				? context.auth.uid
				: '';

  
  if(!entity || !service || !status || !total){
    
	L('save_order_1 :err: missing params');
	throw new FUNCTIONS.https.HttpsError('invalid-argument', 'Missing parameres (entity, service. status, total)');	
	
  }else{
	
    const DATE = new Date();
	const TO_SHOW = DATE.toLocaleTimeString()+' '+DATE.toLocaleDateString();
	const TIMESTAMP = DATE.getTime(); 
	
	
    L('save_order_1 :params: ', entity, service, status, table, total);
	L('CREATION TIME: '+TO_SHOW);
	
	return DB
	.collection('Company')
	.doc(entity)
	.collection('Orders')
	.doc(String(TIMESTAMP))
	.set({
		service,
		status,
		table,
		total,
		date: TIMESTAMP,
		order_identification: orderId
	})
	.then(r => {
			L('save_order_1 :out: order saved => ',r);
		//if(token.length < 10){
			return JSON.stringify({
				data: {
					created_at: TIMESTAMP
				}
			});
		//}else{
			//const message = {
			//  data: {
			//	message: 'Nueva orden'
			//  },
			//  token: token
		//	};

			//ADMIN.messaging().send(message)
			//.then((r2) => {
			//	L('save_order_1 :out: order saved and message sended');
			
			//	return {
			//		data: r2
			//	}; 

			//})
			//.catch((error) => {
				
			//  L('save_order_1 :out: message error => '+error);
			  //throw new FUNCTIONS.https.HttpsError('error', String(error));
			//});			
		//}		
		
	})
	.catch(e => {
		L('save_order_1 :out: message error => '+e);
		throw new FUNCTIONS.https.HttpsError('error', String(e));
	});

  }
});

exports.save_order = FUNCTIONS.https.onRequest(async (req, res) => {

  L('save_order :in:');
  
  const entity = req.query.entity ? req.query.entity.trim() : false;
  const service = req.query.service;
  const status = req.query.status;
  const table = req.query.table;
  const total = req.query.total;
  const orderId = req.query.order_id || '';
  const token = typeof req.query.token === 'undefined'
			? ''
			: req.query.token;
	const serviceDetails = req.query.service_details;
  
  if(!entity || !service || !status || !table || !total){
    
	L('save_order :err: missing params');
    res.status(400).json({
		data: 'Missing parameres (entity, service. status, table, total)'
	});
	
  }else{

		//verificar si hay en stock para la orden
		const VALID_ORDER = await checkIfProductsHaveStock(entity, serviceDetails);
		if(VALID_ORDER){
	
			const DATE = new Date();
			const TO_SHOW = DATE.toLocaleTimeString()+' '+DATE.toLocaleDateString();
			const ORDER_DATE = {
				to_show: TO_SHOW,
				timestamp: DATE.getTime()
			}; 
			
		
			L('save_order :params: ', entity, service, status, table, total);
			L('CREATION TIME: '+TO_SHOW);
			
	
			//	Guardar la orden
			//	TODO: reemplazar por async/await
			DB
			.collection('Company')
			.doc(entity)
			.collection('Orders')
			.doc(String(ORDER_DATE.timestamp))
			.set({
				service,
				status,
				table,
				total,
				date: ORDER_DATE,
				order_identification: orderId
			})
			.then(r => {
				
				if(token.length < 10){
					res.status(200).json({
						data: r
					});
				}else{
					const message = {
						data: {
						message: 'Nueva orden'
						},
						token: token
					};
	
					ADMIN.messaging().send(message)
					.then((r2) => {
						L('save_order :out: order saved and message sended');
					
						res.status(200).json({
							data: r2
						}); 
	
					})
					.catch((error) => {
						
						L('save_order :out: message error => '+error);
						
						res.status(500).json({
						data: error
						});
					});			
				}		
				
			})
			.catch(e => {
				L('save_order :out: message error => '+e);
				res.status(500).json({
					data: e
				})
			});
			//--------------------------------
			
		}else{
			L('save_order :err: inventory not enought');
			res.status(400).json({
				data: 'Inventario insuficiente'
			})
		}
  }
});

exports.send_push = FUNCTIONS.https.onRequest((req, res) => {

  L('send_push :in:');
  
  const to = req.query.to;
  const subject = req.query.subject;

  if(!to || !subject){
    
	L('send_push :err: missing params');
    res.status(400).json('Missing parameres (to, subject)');
	
  }else{
    const messageSubject = `${to} ${subject}`;
	
    const message = {
      data: {
        message: messageSubject
      },
      token: to
    };

    ADMIN
	.messaging()
	.send(message)
    .then((response) => {
      console.log('send_push :out: message sended');
      res.status(200).json({
        data: response
      });

    })
    .catch((error) => {
		
      L('send_push :out: message error => '+error.message);
	  
      res.status(501).json({
        data: error
      });
    });  
  }

});

exports.check_product_availability = FUNCTIONS.https.onRequest(async (req, res) => {
  L('check_product_availability :in:');
  
  const service_detail = req.query.service_detail ? req.query.service_detail : false;
  const entity = req.query.entity ? req.query.entity.trim() : false;
  
  if(!service_detail){    
		L('check_product_availability :err: missing params');
		res.status(400).json({
			data: 'Missing parameres (service_detail)'
		});
	}

	const INGREDIENTS = JSON.parse(service_detail);

	for(let i = 0; i < INGREDIENTS.length; i++) {
		if(!checkProductAvailability(entity, INGREDIENTS[i].id, INGREDIENTS[i].quantity)){
			L('check_product_availability :process: not enought ingredients');
			res.status(400).json({
				data: {
					message: 'Not enought ingredients',
					ingredient_id: INGREDIENTS[i].id
				}
			});
		}
	}

	L('check_product_availability :out: ok');
	res.status(200).json({
		data: 'Ok'
	});

});

async function checkProductAvailability(entity, ingredientId, quantity){
	L('checkProductAvailability :in: ',entity, ingredientId, quantity);
	const INVENTORY = DB
										.collection('Company')
										.doc(entity)
										.collection('Inventory')
										.doc(ingredientId);
										//.get();
	const IN_STOCK = await INVENTORY.get();

	const QUANTITY_IN_STOCK = parseInt(IN_STOCK.data().quantity);
	quantity = parseInt(quantity);
	
	if(quantity > QUANTITY_IN_STOCK){
		return Promise.resolve(false);
	}

	const NEW_QUANTITY = String(QUANTITY_IN_STOCK - quantity);
	L('NEW_QUANTITY >> ',NEW_QUANTITY);

	await INVENTORY.set({
		quantity: NEW_QUANTITY
	}, { merge: true });

	return Promise.resolve(true);
}


async function checkIfProductsHaveStock(entity, serviceDetails){
	L('in checkIfProductsHaveStock >> ',entity, serviceDetails);

	data = JSON.parse(serviceDetails);

	if(!Array.isArray(data.products)){
		L('Invalid service_details');
		return Promise.resolve(true);
	}

	const products = data.products;
	let status = false;

	try{
		let quantity = 0;
		let ingredientId = 0;
		
		for(let i = 0; i < products.length; i++){

			for(let j = 0; j < products[i].ingredients.length; j++){
				
				ingredientId = products[i].ingredients[j].ingredient_id;
				quantity = products[i].ingredients[j].quantity;

				const VALID = await checkProductAvailability(entity, ingredientId, quantity);
				if(!VALID){					
					//break main_for;
					throw 'Not enought';
				}
			}

		}
		status = true;
	}catch(e){
		L('ERR -> ',e);
	}
	return Promise.resolve(status);
}
