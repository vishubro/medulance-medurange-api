module.exports = (sequelize, Sequelize) => {

    const adminlogin = sequelize.define("adminlogin", {
        // id: {
        //     type: Sequelize.INTEGER(11)
        // },
        username: {
            type: Sequelize.STRING(250)
        },
        password: {
            type: Sequelize.STRING(250)
        },
        role: {
            type: Sequelize.STRING(250)
        },
        email: {
            type: Sequelize.STRING(250)
        },
        mobile: {
            type: Sequelize.INTEGER(20)
        },
        gender: {
            type: Sequelize.STRING(2)
        },
        name: {
            type: Sequelize.STRING(150)
        },
        gcmld: {
            type: Sequelize.STRING(100)
        },
        created_at: {
            type: Sequelize.STRING(100)
        },
        updated_at: {
            type: Sequelize.STRING(100)
        },
    });

    return adminlogin;
};

