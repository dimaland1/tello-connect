# Tello Connect

An easy-to-use Node.js module for controlling DJI Tello drones.

## 🚀 Features

- Simple and intuitive interface
- Complete error handling
- Support for all Tello SDK 2.0 commands
- Real-time drone state monitoring
- Comprehensive documentation
- Detailed logging (optional)

## 📦 Installation

```bash
npm install tello-connect
```

## 🔧 Prerequisites

- Node.js >= 14.0.0
- A DJI Tello drone
- Wi-Fi connection to the drone

## 📝 Basic Usage

```javascript
const { TelloController } = require('tello-connect');

async function simpleFlight() {
    const tello = new TelloController({
        debug: true  // Optional: enables detailed logging
    });
    
    try {
        // Initialization
        await tello.initialize();
        
        // Battery check
        const battery = await tello.getBattery();
        console.log(`Battery: ${battery}%`);
        
        // Flight sequence
        await tello.takeoff();
        await tello.move('up', 50);
        await tello.rotate(360);
        await tello.land();
        
    } catch (error) {
        console.error('Error:', error);
        await tello.emergency();
    } finally {
        tello.disconnect();
    }
}
```

## 🛠️ Advanced Configuration

```javascript
const tello = new TelloController({
    ip: '192.168.10.1',        // Drone IP (default)
    commandPort: 8889,         // Command port (default)
    statePort: 8890,          // State port (default)
    debug: true               // Enable logging
});
```

## 📡 State Monitoring

```javascript
tello.onState((state) => {
    console.log('Height:', state.h);
    console.log('Battery:', state.bat);
    console.log('Flight time:', state.time);
});
```

## 🎯 Available Commands

### Basic Control
- `initialize()` - Enter SDK mode
- `takeoff()` - Take off
- `land()` - Land
- `emergency()` - Emergency stop

### Movements
- `move(direction, distance)` - Movement (up, down, left, right, forward, back)
- `rotate(degrees)` - Rotation (positive = clockwise, negative = counterclockwise)
- `flip(direction)` - Flip (l = left, r = right, f = forward, b = back)

### Configuration
- `setSpeed(speed)` - Set speed (10-100 cm/s)

### State Reading
- `getBattery()` - Battery level
- `getSpeed()` - Current speed
- `getTime()` - Flight time
- `getWifi()` - Wi-Fi signal quality

## ⚠️ Error Handling

```javascript
try {
    await tello.move('forward', 50);
} catch (error) {
    if (error.message.includes('timed out')) {
        console.error('Command timed out');
    } else {
        console.error('Error:', error.message);
    }
}
```

## 🤝 Contributing

Contributions are welcome!

## 📄 License

FREE TO USE

## 🙏 Acknowledgments

- DJI and Ryze Tech for the Tello drone
- The Node.js community