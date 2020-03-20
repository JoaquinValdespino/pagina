export class User{
	constructor(
		public user_id: string,
		public name: string,
		public email: string,
		public assignment_id: string,
		public assignment_name: string,
		public password: string,
		public role: string,
		public template_id:string,
		public image:string
	){}
}