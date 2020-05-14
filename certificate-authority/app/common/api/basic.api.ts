import express from "express";

export interface BasicApi {
    getRouter(): express.Router
}
