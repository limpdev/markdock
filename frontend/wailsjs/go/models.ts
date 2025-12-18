export namespace main {
	
	export class Config {
	    symbol: string;
	    theme: string;
	    currents_api_key: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.symbol = source["symbol"];
	        this.theme = source["theme"];
	        this.currents_api_key = source["currents_api_key"];
	    }
	}

}

