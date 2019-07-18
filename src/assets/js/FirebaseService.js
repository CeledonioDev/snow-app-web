class FirebaseService{
	constructor(){
		// const config	= {
		// 	apiKey: "AIzaSyBpJI22AFwHsFL0QeEo1DE3TuexAxTnVxs",
		// 	authDomain: "nieveseats.firebaseapp.com",
		// 	databaseURL: "https://nieveseats.firebaseio.com",
		// 	projectId: "nieveseats",
		// 	storageBucket: "nieveseats.appspot.com",
		// 	messagingSenderId: "187728069073",
		// 	appId: "1:187728069073:web:c24b2e47c6c785fd"
		// },
		// app = firebase.initializeApp(config);
		this.db 	= firebase.firestore();		
		//this.messaging = firebase.messaging(app);
		this.ref = {
			company:	this.db.collection("Company"),
		};
		this.storage = firebase.storage().ref('Company');

		this.setUserLoginObserver();
	}	

	async saveProductPhoto(company, file){
		let name = file.name;
		const uploadTask = await this
														.storage
														.child(company)
														.child('Products/'+name)
														.put(file);

		uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
		}, function(error) {
			console.error('Upload >> ',error);
			// Handle unsuccessful uploads
		});

		const uri = await uploadTask.ref.getDownloadURL();
		return uri;
	}

	async saveCompanyPhoto(file){
		let name = file.name;
		const uploadTask = await this
														.storage
														.child('Company_logo/'+name)
														.put(file);

		uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
		}, function(error) {
			console.error('Upload >> ',error);
			// Handle unsuccessful uploads
		});

		const uri = await uploadTask.ref.getDownloadURL();
		return uri;
	}	

	addPhotoUploadProgressObserver(task){
		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		task.on('state_changed', function(snapshot){
			// Observe state change events such as progress, pause, and resume
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					console.log('Upload is paused');
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					console.log('Upload is running');
					break;
			}
		}, function(error) {
			console.error('Upload >> ',error);
			// Handle unsuccessful uploads
		}
		// , function() {
		// 	// Handle successful uploads on complete
		// 	// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		// 	uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		// 		console.log('File available at', downloadURL);
		// 	});
		// }
		);
	}

	save(data, entity){
		return new Promise((resolve, reject) => {
			try{
				if(typeof this.ref[entity] === 'undefined'){
					reject('Unknown entity '+entity);
				}

				if(!data){
					reject('No '+entity+' data found to save.');
				}
				this.ref[entity]
				.doc()
				.set(data)
				.then(() => resolve(true))
				.catch((error) => reject(error));
			}catch(e){
				reject(e);
			}		
		});
	}

	get(entity){
		return new Promise((resolve, reject) => {
			if(typeof this.ref[entity] === 'undefined'){
				reject('Unknown entity '+entity);
			}
			this.ref[entity]
			.get()
			.then((snapshot) => resolve(snapshot.docs))
			.catch(err => reject(err));			
		});
	}

	update(data, entity){
		return new Promise((resolve, reject) => {
			if(data.key){
				if(typeof this.ref[entity] === 'undefined'){
					reject('Unknown entity '+entity);
				}

				delete data.key;
				this.ref[entity]
				.doc(data.key)
				.set(data, { merge: true })
				.then((resp) => resolve(resp))
				.catch((error) => reject(error));				
			}else{
				reject('No service key found to update')
			}
		});
	}	

	delete(entity, id){
		return new Promise((resolve, reject) => {
			if(typeof this.ref[entity] === 'undefined'){
				reject('Unknown entity '+entity);
			}
			this.ref[entity]
			.doc(id)
			.delete()
			.then(() => resolve(1))
			.catch(err => reject(err));			
		});
	}
	
	getMessagingToken(){
		return new Promise((resolve, reject) => {
			this.messaging
			.getToken()
			.then(response => resolve(response))
			.catch(err => reject(err));
		});
		
		this.messaging.onMessage(msg => {
			console.log('ON MESSAGE ',msg);
		});
	}

	//LOGIN************************************
	getUserToken(user){
		return new Promise((resolve, reject) => {
			try{
				this.userReference
				.doc(user)
				.get()
				.then(data => {
					resolve(data.data().token);
				})
				.catch(e => reject(e));
			}catch(e){
				reject(e);
			}
		});
	}

	makeLogin(username, password){
		return new Promise((resolve, reject) => {			
			firebase
			.auth()
			.signInWithEmailAndPassword(username, password)
			.catch(err => reject(err));				
		});	
	}

	setUserLoginObserver(){
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {				
				this.getUserEstablishment(user.email)
				.then(establishment => {
					localStorage.setItem('user_establishment', establishment);
					localStorage.setItem('user_email', user.email);
				})
				.catch(err => {
					console.log('Error getUserEstablishment ',err);
				});
				if(!window.location.pathname.includes('dashboard.html')){
					//alter(user.email, 'Bienvenido', 'success');
					setTimeout(() => {
						window.location.href = 'dashboard.html';
					}, 1000);
				}
			} else {
				 localStorage.removeItem('user_establishment');
				 localStorage.removeItem('user_email');
				 if(!window.location.pathname.includes('index.html')){
				 	//notify('Se cerro la session, redirecionando...', 'Adios', 'warning');
				 	setTimeout(() => {
				 		window.location.href = 'index.html';
				 	}, 1000);
				 }	
			}
		});		
	}
	
	logout(){
		firebase
		.auth()
		.signOut()
		.then(function() {
			// Sign-out successful.
			console.log('Sign-out successful.');
		})
		.catch(function(error) {
			console.log('ERROR on logout() ',error);
		});		
	}
	//*****************************************
}

export default {
	FirebaseService
};