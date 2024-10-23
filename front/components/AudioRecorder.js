import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AudioRecorder = ({ clientId, onUploadSuccess }) => {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);

            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunks.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                setAudioUrl(URL.createObjectURL(audioBlob));
                audioChunks.current = [];
            };
        } catch (err) {
            console.error("Error accessing audio stream: ", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadAudio = async () => {
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('customerId', clientId);
        formData.append('file', new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' }));

        try {
            const response = await fetch('https://survivor-api.poulpitos.fr/api/notes/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) alert('Audio uploaded successfully!');
            else alert('Error uploading audio.');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className="audio-recorder bg-gray-100 p-4 rounded shadow-sm">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('voiceRecording')}</h4>
            <div className="mt-4">
                {isRecording ? (
                    <button onClick={stopRecording} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
                        {t('stopRecording')}
                    </button>
                ) : (
                    <button onClick={startRecording} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
                        {t('startRecording')}
                    </button>
                )}
            </div>

            {audioUrl && (
                <div className="mt-4">
                    <audio controls src={audioUrl} className="w-full"></audio>
                    <div className="mt-2">
                        <button onClick={uploadAudio} className="px-4 py-2 bg-blue-500 text-white rounded">
                            {t('uploadRecording')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
