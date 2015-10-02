import Role = require('Role');

class Retreater extends Role {
    fits(creep:Creep):boolean {
        return creep.bodyScore([MOVE]) > 0 && creep.hits < creep.hitsMax;
    }

    finished(creep:Creep):boolean {
        if (creep.hits == creep.hitsMax) return true;
        var target = <Creep>creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        return !target || !target.pos.inRangeTo(creep.pos, 5);
    }

    run(creep:Creep):boolean {
        var target = <Creep>creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (c:Creep) => c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0});
        console.log('closest hostile ' + target);
        creep.rangedAttack(target);
        creep.attack(target);
        if(target && target.pos.inRangeTo(creep.pos, 5))
        {
            var maxRange = target.pos.getRangeTo(creep.pos);
            var maxPos = creep.pos;
            for(var dx = -1; dx <= 1; dx++)
                for(var dy = -1; dy <= 1; dy++){
                    if (dx == 0 && dy == 0) continue;
                    var x = creep.pos.x + dx;
                    var y = creep.pos.y + dy;
                    if (x < 0 || y < 0 || x > 49 || y > 49) continue;
                    var pos = creep.room.getPositionAt(x, y);
                    if (!creep.room.isPassable(pos)) continue;
                    var r = target.pos.getRangeTo(x, y);
                    if (r >= maxRange){
                        maxRange = r;
                        maxPos = creep.room.getPositionAt(x, y);
                    }
                }
            console.log('retreat to ' + maxPos + ' newRange = ' + maxRange);
            var res = creep.moveTo(maxPos);
            return res == OK || res == ERR_TIRED;
        }
        return true;
    }
}

export = Retreater;