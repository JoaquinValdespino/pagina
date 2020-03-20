export class Template{
	constructor(
		public _id: string,
		public style_menu: { backgroundColor:String, color:String, fontFamily:String },
		public style_body: { backgroundColor:String, color:String, fontFamily:String },
		public logos: { unam:String, fi:String, assig:String }
	){}
}
