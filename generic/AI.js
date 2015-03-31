vms.depends({
  name: 'AIModule',
  depends: ['Zone']
}, function(){
	function AIModule() {

	}

	var aiModule = new AIModule();

	var AIException = function(message) {
		this.toString = function() {
			return message;
		}
	}

	var AttackerCollection = function() {
		var Attackers = [];

		this.regulate = function( ID, Damage ) {
			var attacker = null;
			
			for (var i in Attackers) {
				if (Attackers[i].ID==ID) {
					attacker = Attackers[i];
					break;
				}
			}

			if (attacker) { // Update
				attacker.Damage+=Damage;
			}
			else {	// Add
				Attackers.push({ ID: ID, Damage: Damage });
			}
		}

		this.clear = function() {
			Attackers = [];
		}

		this.sort = function() {
			if (Attackers.length>1) {
				Attackers = Attackers.sort(function(a,b) {return b.Damage - a.Damage;}); // Sort descending by Damage
			}
			return Attackers;
		}

		this.get = function() {
			return Attackers;
		}
	}

	aiModule.AttackerCollection = AttackerCollection;

	var AICollection = function() {
		var AIS = [];

		this.Get = function(Name) {
			for (var i=0;i<AIS.length;i++)
			{
				if (AIS[i].Name==Name) return AIS[i];
			}
			
			throw new AIException('Could not find AI with the Name '+Name);
			return null;
		}

		this.Add = function(ai) {
			AIS.push(ai);
		}

		this.Make = function(Name, func, TriggerTime) {
			var ai = new AI(Name || func.name, func, TriggerTime);
			AIS.push(ai);
			return ai;
		}
	}

	aiModule.AICollection = AICollection;

	var AI = function(Name, func, TriggerTime) {
		this.Name = Name;
		this.TriggerTime = 1; // Default triggertime for undefined function
		if (typeof(TriggerTime)!='undefined') this.TriggerTime = TriggerTime;
		if (func) this.func = func;
	}

	AI.prototype.func = function(deltaTime) {
		console.log('AI: '+this.AI.Name+' is not yet implemented.');
		return null; // Turns off AI
	}

	aiModule.AI = AI;

	var AIObject = function(ID) {
		this.AIAliveTime = 0;
		this.AITimer = 0;
		this.AI = null;
		this.TriggerTime = 0;
		this.Time2 = 0;

		// Can store info between AI calls if needed
		this.AIMeta = {};

		this.setAI = function(AI,TriggerTime) {
			this.AI = AI;
			this.Time2 = 0;

			if (AI!=null) {
				if (typeof(TriggerTime)!='undefined') {
					this.TriggerTime = TriggerTime;
				} 
				else
				{
					this.TriggerTime = AI.TriggerTime;
				}
			}
		}

		this.step = function(deltaTime) {
			try {
			var result;
			if (this.AI == null) {
				// Do nothing
			}
			else {
				this.AITimer+=deltaTime;
				this.AIAliveTime+=deltaTime;

				if (this.AITimer>=this.TriggerTime) {
					this.AITimer-=this.TriggerTime;
					
					result = this.AI.func.call(this,deltaTime);
					if (result instanceof AI) {
						this.setAI(result);
					}
					else if (result instanceof Object)
					{
						if (result.AI) {
							this.setAI(result.AI,result.Time);
						}
						if (result.Meta) this.AIMeta = result.Meta;
					}
				}
			}
		}
		catch(err) {
			//throw new AIException('The AI ['+this.AI.Name+'] had an error\n'+err);
			console.log('\x1B[31m' + 'The AI ['+this.AI.Name+'] had an error' + '\x1B[0m');
			dumpError(err);
			this.AI = null;
		}
	}

		this.getAliveTime = function() {
			return this.AIAliveTime;
		}
	}

	aiModule.AIObject = AIObject;


	if(typeof module !== "undefined" && module.exports) {
	    module.exports = aiModule;
	}
	if(typeof window !== "undefined") {
	    window.AIModule = aiModule;
	}
});