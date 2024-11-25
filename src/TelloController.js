/**
 * @fileoverview Contrôleur principal pour le drone Tello
 * @module TelloController
 * @author Votre Nom
 * @version 1.0.0
 * @license MIT
 * 
 * Cette classe fournit une interface de haut niveau pour contrôler le drone Tello.
 * Elle encapsule toute la logique de communication et expose des méthodes
 * simples pour contrôler le drone.
 * 
 * @example
 * const tello = new TelloController();
 * await tello.initialize();
 * await tello.takeoff();
 */

const TelloConnection = require('./TelloConnection');
const TelloCommand = require('./TelloCommand');

class TelloController {
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.connection = new TelloConnection(
            options.ip,
            options.commandPort,
            options.statePort,
            this.debug
        );
        this._log('TelloController initialized');
    }

    _log(...args) {
        if (this.debug) {
            console.log('[TelloController]', ...args);
        }
    }

    // Méthodes de base
    async initialize() {
        this._log('Initializing drone');
        const response = await this.connection.sendCommand(TelloCommand.CONTROL_COMMANDS.COMMAND);
        if (response !== 'ok') {
            throw new Error('Failed to initialize drone');
        }
        return true;
    }

    async takeoff() {
        this._log('Taking off');
        return await this.connection.sendCommand(TelloCommand.CONTROL_COMMANDS.TAKEOFF);
    }

    async land() {
        this._log('Landing');
        return await this.connection.sendCommand(TelloCommand.CONTROL_COMMANDS.LAND);
    }

    async emergency() {
        this._log('Emergency stop');
        return await this.connection.sendCommand(TelloCommand.CONTROL_COMMANDS.EMERGENCY);
    }

    // Méthodes de mouvement
    async move(direction, distance) {
        const dirCommand = TelloCommand.MOVE_COMMANDS[direction.toUpperCase()];
        if (!dirCommand) {
            throw new Error(`Invalid direction: ${direction}`);
        }
        
        if (distance < TelloCommand.MIN_DISTANCE || distance > TelloCommand.MAX_DISTANCE) {
            throw new Error(`Distance must be between ${TelloCommand.MIN_DISTANCE} and ${TelloCommand.MAX_DISTANCE}`);
        }

        this._log(`Moving ${direction} by ${distance}cm`);
        return await this.connection.sendCommand(`${dirCommand} ${distance}`);
    }

    async rotate(degrees) {
        if (Math.abs(degrees) < TelloCommand.MIN_DEGREE || Math.abs(degrees) > TelloCommand.MAX_DEGREE) {
            throw new Error(`Rotation degrees must be between ${TelloCommand.MIN_DEGREE} and ${TelloCommand.MAX_DEGREE}`);
        }

        const command = degrees > 0 ? 
            TelloCommand.MOVE_COMMANDS.ROTATE_CW : 
            TelloCommand.MOVE_COMMANDS.ROTATE_CCW;
        
        this._log(`Rotating ${degrees} degrees`);
        return await this.connection.sendCommand(`${command} ${Math.abs(degrees)}`);
    }

    async flip(direction) {
        if (!TelloCommand.VALID_FLIP_DIRECTIONS.includes(direction)) {
            throw new Error(`Invalid flip direction: ${direction}. Must be one of: ${TelloCommand.VALID_FLIP_DIRECTIONS.join(', ')}`);
        }

        this._log(`Flipping ${direction}`);
        return await this.connection.sendCommand(`${TelloCommand.MOVE_COMMANDS.FLIP} ${direction}`);
    }

    // Méthodes de configuration
    async setSpeed(speed) {
        if (speed < TelloCommand.MIN_SPEED || speed > TelloCommand.MAX_SPEED) {
            throw new Error(`Speed must be between ${TelloCommand.MIN_SPEED} and ${TelloCommand.MAX_SPEED}`);
        }

        this._log(`Setting speed to ${speed}`);
        return await this.connection.sendCommand(`${TelloCommand.SET_COMMANDS.SPEED} ${speed}`);
    }

    // Méthodes de lecture
    async getBattery() {
        this._log('Reading battery level');
        const response = await this.connection.sendCommand(TelloCommand.READ_COMMANDS.BATTERY);
        return parseInt(response);
    }

    async getSpeed() {
        this._log('Reading current speed');
        const response = await this.connection.sendCommand(TelloCommand.READ_COMMANDS.SPEED);
        return parseInt(response);
    }

    async getTime() {
        this._log('Reading flight time');
        const response = await this.connection.sendCommand(TelloCommand.READ_COMMANDS.TIME);
        return parseInt(response);
    }

    async getWifi() {
        this._log('Reading WiFi SNR');
        return await this.connection.sendCommand(TelloCommand.READ_COMMANDS.WIFI);
    }

    async getSdk() {
        this._log('Reading SDK version');
        return await this.connection.sendCommand(TelloCommand.READ_COMMANDS.SDK);
    }

    async getSerialNumber() {
        this._log('Reading serial number');
        return await this.connection.sendCommand(TelloCommand.READ_COMMANDS.SN);
    }

    // Gestion des états
    onState(callback) {
        this.connection.onState(callback);
    }

    removeStateListener(callback) {
        this.connection.removeStateCallback(callback);
    }

    // Nettoyage
    disconnect() {
        this._log('Disconnecting');
        this.connection.close();
    }
}

module.exports = TelloController;