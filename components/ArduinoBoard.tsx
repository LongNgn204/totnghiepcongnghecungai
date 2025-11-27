import React from 'react';

export type SimulationMode = 'default' | 'traffic' | 'sensor' | 'button' | 'buzzer' | 'lcd' | 'servo';

interface ArduinoBoardProps {
  ledState: { [pin: number]: boolean }; 
  mode?: SimulationMode;
  sensorValue?: number;
  onSensorChange?: (val: number) => void;
  buttonPressed?: boolean;
  onButtonPress?: (pressed: boolean) => void;
  lcdText?: string[];
  servoAngle?: number;
  tonePlaying?: boolean;
}

const ArduinoBoard: React.FC<ArduinoBoardProps> = ({ 
  ledState, 
  mode = 'default',
  sensorValue = 500,
  onSensorChange,
  buttonPressed = false,
  onButtonPress,
  lcdText = ["", ""],
  servoAngle = 90,
  tonePlaying = false
}) => {
  return (
    <div className="flex gap-6 items-center justify-center scale-90">
      {/* ARDUINO UNO BOARD (LEFT) */}
      <div className="relative w-[300px] h-[420px] bg-cyan-700 rounded-2xl shadow-2xl border-4 border-cyan-900 flex flex-col items-center select-none overflow-hidden transition-transform hover:scale-[1.02] duration-300 z-10">
        {/* Basic Components (USB, Power, Chip) - Keep as is */}
        <div className="absolute top-0 left-6 w-14 h-10 bg-gray-300 rounded-b-lg border-b-4 border-gray-400 shadow-sm z-10" />
        <div className="absolute bottom-6 left-2 w-12 h-14 bg-black rounded-lg border-2 border-gray-800 shadow-lg" />
        <div className="absolute top-[45%] left-[30%] w-32 h-10 bg-neutral-900 rounded-sm border border-gray-700 flex items-center justify-center shadow-inner">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest opacity-80 rotate-0">ATMEGA328P</span>
        </div>
        <div className="absolute top-14 right-6 text-white font-bold italic font-sans tracking-wide opacity-90 drop-shadow-md">
          Arduino <span className="text-xs font-normal">UNO</span>
        </div>
        
        {/* Built-in LED (Pin 13) */}
        <div className="absolute top-[35%] right-[35%] flex flex-col items-center transition-all duration-100">
          <div className={`w-3 h-3 rounded-full transition-all duration-100 ${ledState[13] ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,1)] scale-110' : 'bg-orange-900/50 shadow-none'}`} />
          <span className="text-[8px] text-white font-mono mt-0.5">L</span>
        </div>

        {/* Digital Pins */}
        <div className="absolute top-8 right-2 flex flex-col gap-[3px]">
          {[...Array(14)].reverse().map((_, i) => {
             const pin = i;
             return (
               <div key={pin} className="flex items-center gap-1 group/pin">
                  <span className="text-[8px] text-white font-mono w-3 text-right opacity-70">{pin}</span>
                  <div className="w-8 h-3 bg-black border border-gray-600 rounded-[1px] relative flex items-center justify-center">
                      {/* Highlight active pin */}
                      {ledState[pin] && <div className="absolute inset-0 bg-red-500/20 animate-pulse ring-1 ring-red-500/50" />}
                  </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* EXTERNAL MODULES (RIGHT) - DYNAMIC BASED ON MODE */}
      <div className="flex flex-col gap-4 min-w-[160px]">
        
        {/* MODULE: TRAFFIC LIGHT */}
        {mode === 'traffic' && (
          <div className="bg-gray-800 p-4 rounded-xl border-2 border-gray-600 shadow-xl flex flex-col items-center gap-3 w-[120px]">
            <div className="text-xs text-gray-400 font-bold uppercase">Traffic Light</div>
            <div className="bg-black p-3 rounded-lg border border-gray-700 flex flex-col gap-2 shadow-inner">
              <div className={`w-10 h-10 rounded-full border-2 border-red-900 transition-all duration-200 ${ledState[13] ? 'bg-red-500 shadow-glow-red' : 'bg-red-900/20'}`} />
              <div className={`w-10 h-10 rounded-full border-2 border-yellow-900 transition-all duration-200 ${ledState[12] ? 'bg-yellow-400 shadow-glow-yellow' : 'bg-yellow-900/20'}`} />
              <div className={`w-10 h-10 rounded-full border-2 border-green-900 transition-all duration-200 ${ledState[11] ? 'bg-green-500 shadow-glow-green' : 'bg-green-900/20'}`} />
            </div>
          </div>
        )}

        {/* MODULE: SENSOR (LDR) */}
        {mode === 'sensor' && (
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-xl flex flex-col items-center gap-3 w-[160px]">
            <div className="text-xs text-slate-500 font-bold uppercase">Light Sensor</div>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-slate-200 shadow-inner transition-colors duration-500"
                 style={{ background: `hsl(60, 100%, ${Math.max(10, sensorValue / 10.23)}%)` }}>
               <div className="absolute inset-0 flex items-center justify-center text-4xl">
                 {sensorValue > 500 ? '☀️' : '🌑'}
               </div>
            </div>
            <input 
              type="range" min="0" max="1023" value={sensorValue} 
              onChange={(e) => onSensorChange && onSensorChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 w-full justify-center">
               <div className={`w-4 h-4 rounded-full border border-slate-300 ${ledState[13] ? 'bg-red-500 shadow-glow' : 'bg-slate-200'}`} />
               <span className="text-xs text-slate-600">Pin 13</span>
            </div>
          </div>
        )}

        {/* MODULE: BUTTON */}
        {mode === 'button' && (
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-xl flex flex-col items-center gap-4 w-[160px]">
            <div className="text-xs text-slate-500 font-bold uppercase">Push Button (Pin 2)</div>
            <button
              onMouseDown={() => onButtonPress && onButtonPress(true)}
              onMouseUp={() => onButtonPress && onButtonPress(false)}
              onMouseLeave={() => onButtonPress && onButtonPress(false)}
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all active:scale-95 ${
                buttonPressed 
                ? 'bg-red-600 border-red-800 shadow-inner translate-y-1' 
                : 'bg-red-500 border-red-700 shadow-lg -translate-y-1'
              }`}
            >
              <span className="text-white font-bold text-xs">PUSH</span>
            </button>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 w-full justify-center">
               <div className={`w-4 h-4 rounded-full border border-slate-300 ${ledState[13] ? 'bg-green-500 shadow-glow-green' : 'bg-slate-200'}`} />
               <span className="text-xs text-slate-600">Output (Pin 13)</span>
            </div>
          </div>
        )}

        {/* MODULE: BUZZER */}
        {mode === 'buzzer' && (
          <div className="bg-gray-900 p-4 rounded-xl border-2 border-gray-700 shadow-xl flex flex-col items-center gap-3 w-[160px]">
            <div className="text-xs text-gray-400 font-bold uppercase">Piezo Buzzer (Pin 8)</div>
            <div className={`w-24 h-24 rounded-full bg-black border-4 border-gray-600 flex items-center justify-center relative ${tonePlaying ? 'animate-pulse' : ''}`}>
               {/* Speaker Mesh */}
               <div className="w-16 h-16 rounded-full border-2 border-gray-800 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjMzMzIiAvPjwvc3ZnPg==')] opacity-50" />
               {/* Sound Waves Animation */}
               {tonePlaying && (
                 <>
                   <div className="absolute inset-0 rounded-full border-2 border-yellow-500 opacity-0 animate-ping" />
                   <div className="absolute -inset-2 rounded-full border-2 border-yellow-500 opacity-0 animate-ping delay-75" />
                 </>
               )}
            </div>
            <div className="text-xs text-yellow-500 font-mono h-4">{tonePlaying ? '♪ BEEP BEEP ♪' : '...'}</div>
          </div>
        )}

        {/* MODULE: LCD 16x2 */}
        {mode === 'lcd' && (
          <div className="bg-blue-900 p-2 rounded-lg border-4 border-gray-400 shadow-xl w-[280px] flex flex-col items-center">
             <div className="w-full bg-lime-400 h-24 border-4 border-neutral-950 p-2 font-mono text-black shadow-inner relative overflow-hidden">
                {/* Grid Effect */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjkiIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] pointer-events-none" />
                
                {/* Text Content */}
                <div className="relative z-10 leading-8 font-bold tracking-widest">
                   <div>{lcdText[0] || ""}</div>
                   <div>{lcdText[1] || ""}</div>
                </div>
             </div>
             <div className="text-[10px] text-white mt-1 font-bold">LCD 16x2 (I2C)</div>
          </div>
        )}

        {/* MODULE: SERVO */}
        {mode === 'servo' && (
          <div className="bg-gray-200 p-4 rounded-xl border-2 border-gray-400 shadow-xl flex flex-col items-center gap-3 w-[160px]">
             <div className="text-xs text-slate-600 font-bold uppercase">Micro Servo (Pin 9)</div>
             <div className="relative w-24 h-32 bg-blue-600 rounded-lg border-2 border-blue-800 shadow-lg flex flex-col items-center pt-2">
                <span className="text-[8px] text-white font-bold">SG90</span>
                {/* Servo Horn (Arm) */}
                <div 
                  className="absolute top-8 w-28 h-4 bg-white rounded-full border border-gray-400 shadow-md origin-center transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${servoAngle - 90}deg)` }}
                >
                   <div className="w-2 h-2 bg-black rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /> {/* Screw */}
                   <div className="w-1 h-1 bg-gray-400 rounded-full absolute left-2 top-1.5" />
                   <div className="w-1 h-1 bg-gray-400 rounded-full absolute right-2 top-1.5" />
                </div>
             </div>
             <div className="text-xs font-mono font-bold text-blue-800">{servoAngle}°</div>
          </div>
        )}

        {/* DEFAULT: BREADBOARD */}
        {mode === 'default' && (
          <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-lg w-[140px]">
             <div className="grid grid-cols-5 gap-1 mb-4">
                {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-200 rounded-full mx-auto"/>)}
             </div>
             <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full border border-red-800 transition-all ${ledState[8] || ledState[13] ? 'bg-red-500 shadow-glow' : 'bg-red-900/20'}`} />
                <span className="text-[10px] text-slate-400">LED</span>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArduinoBoard;