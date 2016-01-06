module.exports = function(db, DataTypes) {
    return db.define("country", {
        id: { type: DataTypes.INTEGER(5), primaryKey: true },
        alpha2: { type: DataTypes.STRING(2), unique: true, index: true },
        alpha3: { type: DataTypes.STRING(3), unique: true, index: true },
        name: { type: DataTypes.STRING(64), unique: true, index: true },
        alt_name: { type: DataTypes.STRING(64), index: true },
    }, {
        timestamps: false,
        tableName: 'country'
    });
};