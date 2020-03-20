export class Request{
	constructor(
		public request_id: string,
		public name: string,
		public tipoET: string,
		public profesor_name: string,
		public subtopic: string,
		public estatus: string,
		public justification: string,
		public material_id: string,
		public file_name: string,
		public link: string,
		public assignment_id: string		
	){}
}