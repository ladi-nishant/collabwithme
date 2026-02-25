import React, { useEffect, useRef, useState } from 'react';
import { ScreenShare as ShareIcon, StopCircle } from 'lucide-react';

const ScreenShare = ({ socket, roomId, user, isHost }) => {
    const [sharing, setSharing] = useState(false);
    const localVideoRef = useRef(null);
    const [remoteStreams, setRemoteStreams] = useState({}); // userId -> MediaStream
    const peerConnections = useRef({}); // userId -> RTCPeerConnection
    const streamRef = useRef(null);

    const iceServers = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('webRTC_offer', async (data) => {
            const pc = createPeerConnection(data.sender);
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webRTC_answer', { target: data.sender, answer });
        });

        socket.on('webRTC_answer', async (data) => {
            const pc = peerConnections.current[data.sender];
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });

        socket.on('webRTC_candidate', async (data) => {
            const pc = peerConnections.current[data.sender];
            if (pc) {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        return () => {
            socket.off('webRTC_offer');
            socket.off('webRTC_answer');
            socket.off('webRTC_candidate');
            stopSharing();
        };
    }, [socket]);

    const createPeerConnection = (targetId) => {
        const pc = new RTCPeerConnection(iceServers);
        peerConnections.current[targetId] = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('webRTC_candidate', { target: targetId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [targetId]: event.streams[0]
            }));
        };

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => pc.addTrack(track, streamRef.current));
        }

        return pc;
    };

    const startSharing = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            streamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            setSharing(true);

            stream.getVideoTracks()[0].onended = () => stopSharing();

            socket.emit('request_user_list_for_sharing', { roomId });

            socket.on('user_list_for_sharing', (users) => {
                users.forEach(u => {
                    if (u.id !== socket.id) {
                        const pc = createPeerConnection(u.id);
                        pc.createOffer().then(offer => {
                            pc.setLocalDescription(offer);
                            socket.emit('webRTC_offer', { target: u.id, offer });
                        });
                    }
                });
            });

        } catch (err) {
            console.error("Error starting screen share:", err);
        }
    };

    const stopSharing = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        setSharing(false);

        Object.values(peerConnections.current).forEach(pc => pc.close());
        peerConnections.current = {};
        setRemoteStreams({});
    };

    return (
        <div className="screen-share-controls" style={{ marginTop: '10px' }}>
            {!sharing ? (
                <button className="btn-primary" onClick={startSharing} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 12px', width: '100%', justifyContent: 'center' }}>
                    <ShareIcon size={16} /> Share Screen
                </button>
            ) : (
                <button className="btn-primary" onClick={stopSharing} style={{ background: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 12px', width: '100%', justifyContent: 'center' }}>
                    <StopCircle size={16} /> Stop Sharing
                </button>
            )}

            <div style={{ marginTop: '10px' }}>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: sharing ? '100%' : '0', borderRadius: '8px', display: sharing ? 'block' : 'none', border: '1px solid var(--glass-border)' }} />
            </div>

            <div className="remote-videos" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {Object.entries(remoteStreams).map(([id, stream]) => (
                    <div key={id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <video
                            autoPlay
                            playsInline
                            ref={el => { if (el) el.srcObject = stream; }}
                            style={{ width: '100%', display: 'block' }}
                        />
                        <div style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'var(--glass-bg)', color: 'var(--text-dark)' }}>
                            User Stream
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScreenShare;
