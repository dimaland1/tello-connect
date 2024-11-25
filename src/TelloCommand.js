/**
 * @fileoverview Définition des commandes disponibles pour le drone Tello
 * @module TelloCommand
 * @author Votre Nom
 * @version 1.0.0
 * @license MIT
 * 
 * Cette classe énumère toutes les commandes disponibles pour le drone Tello.
 * Elle sert de référence centrale pour toutes les commandes possibles et leurs paramètres.
 * 
 * @example
 * const { TelloCommand } = require('tello-drone-controller');
 * console.log(TelloCommand.CONTROL_COMMANDS.TAKEOFF); // 'takeoff'
 */

class TelloCommand {
    static CONTROL_COMMANDS = {
        COMMAND: 'command',
        TAKEOFF: 'takeoff',
        LAND: 'land',
        EMERGENCY: 'emergency',
        STOP: 'stop',
        STREAM_ON: 'streamon',
        STREAM_OFF: 'streamoff'
    };

    static MOVE_COMMANDS = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right',
        FORWARD: 'forward',
        BACK: 'back',
        ROTATE_CW: 'cw',
        ROTATE_CCW: 'ccw',
        FLIP: 'flip'
    };

    static READ_COMMANDS = {
        SPEED: 'speed?',
        BATTERY: 'battery?',
        TIME: 'time?',
        WIFI: 'wifi?',
        SDK: 'sdk?',
        SN: 'sn?'
    };

    static SET_COMMANDS = {
        SPEED: 'speed',
        RC: 'rc',
        WIFI: 'wifi'
    };
    
    static VALID_FLIP_DIRECTIONS = ['l', 'r', 'f', 'b'];
    static MIN_SPEED = 10;
    static MAX_SPEED = 100;
    static MIN_DISTANCE = 20;
    static MAX_DISTANCE = 500;
    static MIN_DEGREE = 1;
    static MAX_DEGREE = 360;
}

module.exports = TelloCommand;