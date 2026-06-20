const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
	id:{
		type:DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true
	},
	name:{
		type: DataTypes.STRING(100),
		allowNull:false
	},
	email:{
		type:DataTypes.STRING(100),
		allowNull:false,
		unique:true
	},
	password:{
		type:DataTypes.STRING(300),
		allowNull:false
	},
	role:{
		type:DataTypes.ENUM('EMPLOYEE','ADMIN','MANAGER'),
		allowNull:false
	},
	department_id:{
		type:DataTypes.INTEGER,
		allowNull:true
	},
	manager_id:{
		type:DataTypes.INTEGER,
		allowNull:true
	}
},{
	tableName:'users',
	timestamps:true,
	underscored:true
});

module.exports=User;