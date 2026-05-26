import React, { useState } from 'react';


export default function DiagnosticDrawer({ isOpen, onClose, initialErrorCode }) {


    // 1. Core state tracking parameters

    const [messages, setMessages] = useState([
        {
            sender: 'system',
            text: 'AI Diagnostic Terminal Online. Waiting for operator input parameters...'
        }
    ]);
    const [inputBuffer, setInputBuffer] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);


    // src/components/DiagnosticDrawer.jsx (Update this specific function)

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!inputBuffer.trim() || isProcessing) return;

        const operatorText = inputBuffer;


        // 1. Add the operator's message to the chat view instantly

        const userMessage = { sender: 'operator', text: operatorText };
        setMessages((prev) => [...prev, userMessage]);
        setInputBuffer('');


        // 2. Lock the input and activate the gray loading status indicator

        setIsProcessing(true);

        try {


            // 3. Initiate the HTTP POST request to your FastAPI port

            const response = await fetch('http://127.0.0.1:8005/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: operatorText }),
            });

            if (!response.ok) {
                throw new Error(`Server returned network status code: ${response.status}`);
            }


            // 4. Inhale the validated Pydantic data schema payload from FastAPI

            const data = await response.json();


            // 5. Append the true AI synthesis text to the chat window memory array

            setMessages((prev) => [
                ...prev,
                { sender: 'ai', text: data.ai_synthesis }
            ]);

        } catch (error) {
            console.error("HMI Communication Fault:", error);


            // Fallback display if your FastAPI backend isn't actively turned on

            setMessages((prev) => [
                ...prev,
                { sender: 'system', text: `LINK FAILURE: Unable to contact port 8005. Confirm your uvicorn server is running.` }
            ]);
        } finally {


            // 6. Release input locks regardless of network pass or failure

            setIsProcessing(false);
        }
    };


    return (
        <div
            className={`fixed top-0 right-0 h-screen w-96 bg-zinc-900 border-l border-zinc-800 text-zinc-100 z-50 transform transition-transform duration-300 ease-in-out flex flex-col font-mono shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            {/* Drawer Header Segment */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">
                        DCS Diagnostic Assistant
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                        Active Context: {initialErrorCode || 'General Manual Interrogation'}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-zinc-100 text-sm px-2 py-1 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 transition-colors"
                >
                    ✕ CLOSE
                </button>
            </div>

            {/* Conversation Activity Log Monitor Viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed"
                style={{
                    scrollbarWidth: 'none',     /* Firefox */
                    msOverflowStyle: 'none',   /* IE and Edge */
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                    display: none;
                    }
                `}</style>

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded border ${msg.sender === 'operator'
                            ? 'bg-zinc-800 border-zinc-700 text-right ml-8'
                            : msg.sender === 'system'
                                ? 'bg-zinc-950 border-orange-900/30 text-orange-400'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-300 mr-8'
                            }`}
                    >
                        <div className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
                            [{msg.sender}]
                        </div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                ))}
            </div>

            {/* Operator Data Command Input Entry Form Area */}
            <form onSubmit={handleFormSubmit} className="p-3 border-t border-zinc-800 bg-zinc-950">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputBuffer}
                        onChange={(e) => setInputBuffer(e.target.value)}
                        placeholder="Type device target queries..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-orange-500 text-zinc-100 placeholder-zinc-600"
                    />
                    <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded transition-colors uppercase tracking-wider"
                    >
                        Execute
                    </button>
                </div>
            </form>
        </div>
    );
}
