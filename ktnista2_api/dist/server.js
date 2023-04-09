"use strict";
//**********************************************************************************************************************************
//* ALL RIGHTS RESERVED. COPYRIGHT (C) 2023 KTNISTA                                                                                *
//**********************************************************************************************************************************
//* File Name    : servier.ts                                                                                                      *
//* Function     : Server setup                                                                                                    *
//* System Name  : Ktnista Api                                                                                                     *
//* Create       : LinhTrinh 08/04/2023                                                                                            *
//* Update       :                                                                                                                 *
//* Comment      :                                                                                                                 *
//**********************************************************************************************************************************
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// #region Import module
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// #endregion Import module
const app = (0, express_1.default)();
// #region Start server
const PORT = process.env.PORT || 10797;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`KTnista API listening at http://localhost:${PORT}`);
});
// #endregion Start server
