function UserPool(){
	this.users = {};
	this.in_range_graph = {};
}

//user should have 5 attributes: user_id, location, socket, and chat_style, nickname
UserPool.prototype.add = function(user){
	this.users[user.user_id] = user;
};

UserPool.prototype.remove = function(user_id){
	delete this.users[user_id];	
};

UserPool.prototype.eachUser = function(fn){
	for(var user in this.users){
		fn(this.users[user]);
	}
};

UserPool.prototype.find_by_user_id = function(user_id){
    return this.users[user_id];
};

UserPool.prototype.eachUser = function(fn) {
	for(var user_id in this.users){
		fn(this.users[user_id]);
	}
};

UserPool.prototype.nicknameUnique = function(nickname){
  var nicknameFound = false;
  this.eachUser(function(user){
    if(user.getNickname() === nickname){
      nicknameFound = true;
    }
  });
  return !nicknameFound;
};

UserPool.prototype.users_are_now_in_range = function(user1_id, user2_id){
	if(this.in_range_graph[user1_id] === undefined){
		this.in_range_graph[user1_id] = {};
	}
	if(this.in_range_graph[user1_id][user2_id] === undefined){
		this.in_range_graph[user1_id][user2_id] = true;
	}
	
	if(this.in_range_graph[user2_id] === undefined){
		this.in_range_graph[user2_id] = {};
	}
	if(this.in_range_graph[user2_id][user1_id] === undefined){
		this.in_range_graph[user2_id][user1_id] = true;
	}
};

UserPool.prototype.users_are_now_out_of_range = function(user1_id, user2_id){
	if(this.in_range_graph[user1_id] !== undefined){
		delete this.in_range_graph[user1_id][user2_id];
	}
	
	if(this.in_range_graph[user2_id] !== undefined){
		delete this.in_range_graph[user2_id][user1_id];
	}
};

UserPool.prototype.delta_users_in_range = function(user, new_lat, new_long){
	var delta_users = [];
	
	if(user.getLatitude() === null || user.getLongitude === null){
		this.eachUser(function(potential_user_in_range){
			if(potential_user_in_range.isWithinRange(new_lat, new_long)){
				delta_users.push(user);	
			}
		});
	}
	else{
		this.users_not_in_range(user).forEach(function(user_was_not_in_range){
			if(user_was_not_in_range.isWithinRange(new_lat, new_long)){
				delta_users.push(user_was_not_in_range);
			}
		});
	}
	
	return delta_users;
};

UserPool.prototype.delta_users_out_of_range = function(user, new_lat, new_long){
	if(user.getLatitude() === null || user.getLongitude === null){
		return [];
	}
	else{
		var delta_users = [];
	
		this.users_in_range(user).forEach(function(user_was_in_range){
			if(user_was_in_range.isWithinRange(new_lat, new_long) === false){
				delta_users.push(user_was_in_range);
			}
		});
	
		return delta_users;
	}
};

UserPool.prototype.users_in_range = function(user){
	var in_range_users = [];
	
	this.in_range_graph[user1_id].keys().forEach(function(key){
		in_range_users.push(this.users[key]);
	});
	
	return in_range_users;
};

UserPool.prototype.users_not_in_range = function(user){
	var out_of_range_users = [];
	
	this.eachUser(function(iterative_user){
		if(this.are_users_in_range(user.id, iterative_user.id) === false){
			out_of_range_users.push(iterative_user);
		}
	});
	
	return out_of_range_users;
};

UserPool.prototype.are_users_in_range = function(user1_id, user2_id){
	if(this.in_range_graph[user1_id] !== undefined && this.in_range_graph[user1_id][user2_id] === true){
		return true;
	}
	else{
		return false;
	}
};

UserPool.prototype.to_s = function(){
	var result = "";
	for(var user_id in this.users){
		result += this.users[user_id].to_s() + "\n";
	}
	return result;
};

module.exports = UserPool;
