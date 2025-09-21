import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const VoiceInterface = ({ onCommand, onTranscription, className = '' }) => {
  const { t, currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [supportedCommands] = useState([
    'Add new product',
    'Show my sales',
    'Create product description',
    'Generate social media post',
    'Check inventory',
    'Update product price'
  ]);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = getLanguageCode(currentLanguage);

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript && onTranscription) {
          onTranscription(finalTranscript, confidence);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentLanguage, onTranscription]);

  const getLanguageCode = (lang) => {
    const languageCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN'
    };
    return languageCodes[lang] || 'en-US';
  };

  const startListening = async () => {
    try {
      // Request microphone permission and setup audio visualization
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average);
        
        if (isListening) {
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setAudioLevel(0);
  };

  const processCommand = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/voice/process-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: transcript,
          language: currentLanguage,
          confidence: confidence
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const result = await response.json();
      
      if (onCommand) {
        onCommand(result);
      }

      // Clear transcript after successful processing
      setTranscript('');
      
    } catch (error) {
      setError('Failed to process voice command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError('');
    setConfidence(0);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Voice Assistant</h3>
          <p className="text-gray-600">Speak naturally to manage your products</p>
        </div>
      </div>

      {/* Voice Visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-primary-500 hover:bg-primary-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <Loader className="w-8 h-8 text-white animate-spin" />
            ) : isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          
          {/* Audio level visualization */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" 
                 style={{ 
                   transform: `scale(${1 + (audioLevel / 255) * 0.5})`,
                   opacity: 0.6 + (audioLevel / 255) * 0.4
                 }} 
            />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {isListening && (
          <div className="flex items-center justify-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium">Listening...</span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="font-medium">Processing command...</span>
          </div>
        )}
        {!isListening && !isProcessing && (
          <span className="text-gray-500">Click the microphone to start</span>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">You said:</div>
              <div className="text-gray-900 font-medium">{transcript}</div>
              {confidence > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => speakText(transcript)}
                className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                title="Play back"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={clearTranscript}
                className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {transcript && !isProcessing && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={processCommand}
            className="flex-1 btn-primary py-2"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Execute Command
          </button>
          <button
            onClick={clearTranscript}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Supported Commands */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Supported Commands:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {supportedCommands.map((command, index) => (
            <div 
              key={index}
              className="text-xs text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setTranscript(command)}
            >
              "{command}"
            </div>
          ))}
        </div>
      </div>

      {/* Language Support Note */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Currently supporting: English, Hindi, Bengali, Tamil, Telugu, Marathi
      </div>
    </div>
  );
};

export default VoiceInterface;
