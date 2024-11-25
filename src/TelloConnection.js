/**
 * @fileoverview Gestion de la connexion UDP avec le drone Tello
 * @module TelloConnection
 * @author Votre Nom
 * @version 1.0.0
 * @license MIT
 * 
 * Cette classe gère la communication UDP avec le drone Tello.
 * Elle maintient deux connexions UDP :
 * - Une pour l'envoi des commandes (port 8889)
 * - Une pour la réception des états (port 8890)
 * 
 * @example
 * const connection = new TelloConnection();
 * await connection.sendCommand('command');
 */

const dgram = require('dgram');

class TelloConnection {
    constructor(droneIp = '192.168.10.1', dronePort = 8889, statePort = 8890, debug = false) {
        this.droneIp = droneIp;
        this.dronePort = dronePort;
        this.statePort = statePort;
        this.debug = debug;
        this.commandSocket = dgram.createSocket('udp4');
        this.stateSocket = dgram.createSocket('udp4');
        this.isConnected = false;
        this.stateCallbacks = [];

        this._setupSockets();
    }

    _log(...args) {
        if (this.debug) {
            console.log('[TelloConnection]', ...args);
        }
    }

    _setupSockets() {
        // Configuration du socket d'état
        this.stateSocket.bind(this.statePort);
        
        this.stateSocket.on('message', (msg) => {
            const state = this._parseState(msg.toString());
            this._log('State received:', state);
            this.stateCallbacks.forEach(callback => callback(state));
        });

        this.stateSocket.on('error', (err) => {
            this._log('State socket error:', err);
        });

        this.commandSocket.on('error', (err) => {
            this._log('Command socket error:', err);
        });
    }

    _parseState(stateString) {
        const pairs = stateString.split(';');
        const state = {};
        pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
                state[key.trim()] = isNaN(value) ? value : Number(value);
            }
        });
        return state;
    }

    async sendCommand(command, timeout = 5000) {
        return new Promise((resolve, reject) => {
            this._log('Sending command:', command);
            
            const timeoutId = setTimeout(() => {
                reject(new Error(`Command ${command} timed out after ${timeout}ms`));
            }, timeout);

            try {
                this.commandSocket.send(command, this.dronePort, this.droneIp, (err) => {
                    if (err) {
                        clearTimeout(timeoutId);
                        this._log('Command error:', err);
                        reject(err);
                        return;
                    }

                    this.commandSocket.once('message', (response) => {
                        clearTimeout(timeoutId);
                        const responseStr = response.toString().trim();
                        this._log('Command response:', responseStr);
                        resolve(responseStr);
                    });
                });
            } catch (error) {
                clearTimeout(timeoutId);
                this._log('Command exception:', error);
                reject(error);
            }
        });
    }

    onState(callback) {
        if (typeof callback === 'function') {
            this.stateCallbacks.push(callback);
        }
    }

    removeStateCallback(callback) {
        this.stateCallbacks = this.stateCallbacks.filter(cb => cb !== callback);
    }

    close() {
        this._log('Closing connections');
        this.commandSocket.close();
        this.stateSocket.close();
        this.isConnected = false;
        this.stateCallbacks = [];
    }
}

module.exports = TelloConnection;