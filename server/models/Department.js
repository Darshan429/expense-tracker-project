const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Department = sequelize.define('Department',{
	id:{
		type:DataTypes.INTEGER,
		primaryKey:true,
		autoIncrement:true
	},
	name:{
		type:DataTypes.INTEGER,
		allowNull:true,
		unique:true
	},
	description:{
		type:DataTypes.TEXT,
		allowNull:true
	}},

	{
		tableName:'departments',
		timestamps:true,
		underscored:true
	});

module.exports=Department;
