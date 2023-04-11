//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : db_connect.config.ts                                                                                            *
//* Function     : Connect mongo db                                                                                                *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 09/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************

// #region Import mudule
import { ConnectionOptions } from 'tls';
import db from '../models/index.model';
// #endregion Import mudule

// #region Export default
export default () => {
    // Create connections
    const connect = () => {
        db.mongoose.connect(String(process.env.DB_CONNECT), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectionOptions).then(() => {
            //initial();
            console.log('MongoDB connected successfully!');
        }).catch((err: Error) => {
            console.log('Cannot connect to the database!\n', err);
            process.exit(1);
        });
    };

    // Connecting
    connect();

    // Continue connect if disconnected
    db.mongoose.connection.on('disconnected', connect);
}
// #endregion Exports