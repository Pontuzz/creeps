module.exports = {
	waitTimeout: 2,

	finished: function(creep) { return creep.carry.energy == 0; },

	fits: function(creep){
		return creep.carry.energy == creep.carryCapacity &&
			creep.bodyScore([MOVE, CARRY]) > 0 && 
			!creep.room.isSpawningTime() &&
			findEnergySinks(creep).length > 0;
	},
	
	run: function(creep){
		var sinks = findEnergySinks(creep);
		if (sinks.length == 0) {
			var t = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (t.length) {
				var index = Math.floor(Game.time / 20) % t.length;
				creep.say("no sinks");
				creep.moveTo(t[index].pos);
			}
			return false;
		}
		var s = creep.pos.findClosestByPath(sinks);
		return creep.approachAndDo(s, () => creep.transferEnergy(s));
	}
};


function findEnergySinks(creep){
	return creep.room.find(FIND_MY_CREEPS, {filter: c => 
			c.memory.role == 'upgrader' && c.carry.energy < c.carryCapacity && c.pos.canAssign(creep)});
}

