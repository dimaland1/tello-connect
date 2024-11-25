/**
 * @fileoverview Point d'entrée principal du module Tello Drone Controller
 * @module index
 * @author Votre Nom
 * @version 1.0.0
 * @license MIT
 * 
 * Ce fichier exporte les classes principales du module.
 * Il sert de point d'entrée unique pour l'utilisation de la bibliothèque.
 * 
 * @example
 * const { TelloController, TelloCommand } = require('tello-drone-controller');
 */

const TelloController = require('./TelloController');
const TelloCommand = require('./TelloCommand');

module.exports = {
    TelloController,
    TelloCommand
};