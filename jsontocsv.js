/**
 * Convert Json Array in CSV
 * @since 2013-11-19
 * @author Emiliano Eloi <emilianoeloi@gmail.com>
 */ 
var Converter = function(){
	self = this;
	this.jsonContainer = null;
	this.csvContainer = null;
	this.converterForm = null;
	this.downloadButton = null;
	this.defaultSeparator = ",";
	this.separator = this.defaultSeparator;
	this.defaultJsonText = '[{"rfc":4627, "name":"json"}, {"rfc":4180,"name":"csv"}]';
};
Converter.prototype = {
	Initialize : function(){
	
		this.jsonContainer = document.querySelector("#converter .json");
		this.csvContainer = document.querySelector("#converter .csv");
		this.converterForm = document.querySelector("#converter");
		this.downloadLink = document.querySelector("#converter a");
		this.separatorContainer = document.querySelector("#converter .separator");
		
		this.jsonContainer.value = this.defaultJsonText;
		this.csvContainer.disabled = "disabled";
		this.converterForm.addEventListener('submit',  function(e){
			e.preventDefault();
			self.convert();
			return false;
		}, false);
	},
	convert : function(){
		try{
			console.profile('convertProfile');
			console.time('convertTime');
			
			if(this.separatorContainer.value != "")
				this.separator = this.separatorContainer.value;
			else
				this.separator = this.defaultSeparator;
			this.separatorContainer.value = this.separator;
			
			var list = JSON.parse(this.jsonContainer.value);
			var obj = list[0];
			var head = [];
			Object.getOwnPropertyNames ( obj );
			Object.keys( obj )
			list.forEach.call( Object.keys( obj ), function( key ){    
				head.push(key);
			});
			this.csvContainer.value = head.join(this.separator);
			
			var body = [];
			for(var i in list){
				this.csvContainer.value += "\n";
				var item = list[i];
				var line = [];
				for(var h in head){
					line.push(item[head[h]]);
				}
				this.csvContainer.value += line.join(this.separator);	
			}
			console.timeEnd('convertTime');
			console.profileEnd();
			this.prepareCSVDownload();
		}catch(e){
			console.timeEnd('convertTime');
			console.profileEnd();
			this.csvContainer.value = e;
		}
	},
	prepareCSVDownload : function(){
		this.downloadLink.href = "data:application/octet-stream;filename=jsonto.csv," +  encodeURIComponent(this.csvContainer.value);	 
	}
}
Converter.Load = function(){
	var _data = new Converter();
	_data.Initialize();
};

window.onload = function(){
	Converter.Load();
};
